import { Hono } from "hono";
import { eq, and } from "drizzle-orm";
import { db } from "../db";
import { users, cars, refreshTokens, verificationTokens } from "../db/schema";
import { hashPassword, comparePassword } from "../utils/hash";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt";
import { sendVerificationEmail, sendPasswordResetEmail } from "../utils/email";
import { authMiddleware } from "../middleware/auth";

const ROLE = "driver";

const driverAuth = new Hono();

// POST /register
driverAuth.post("/register", async (c) => {
  const body = await c.req.json();
  const {
    email, password, fullName, phoneNumber, licenseNumber,
    vehicleNumber, vehicleMake, vehicleModel, vehicleColor, vehicleYear, vehicleSeats,
  } = body;

  if (!email || !password || !fullName || !phoneNumber || !licenseNumber
      || !vehicleNumber || !vehicleMake || !vehicleModel || !vehicleColor || !vehicleYear || !vehicleSeats) {
    return c.json(
      { error: "All fields are required" },
      400,
    );
  }

  if (password.length < 8) {
    return c.json({ error: "Password must be at least 8 characters" }, 400);
  }

  const currentYear = new Date().getFullYear();
  if (vehicleYear < 1900 || vehicleYear > currentYear) {
    return c.json({ error: "Invalid vehicle year" }, 400);
  }

  if (vehicleSeats < 1 || vehicleSeats > 99) {
    return c.json({ error: "Invalid number of seats" }, 400);
  }

  const existing = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existing.length > 0) {
    return c.json({ error: "Email already registered" }, 409);
  }

  const passwordHash = await hashPassword(password);

  const [driver] = await db
    .insert(users)
    .values({
      email, passwordHash, name: fullName, phone: phoneNumber,
      role: ROLE, licenseNumber,
    })
    .returning({ id: users.id, email: users.email });

  await db
    .insert(cars)
    .values({
      driverId: driver.id,
      brand: vehicleMake,
      model: vehicleModel,
      color: vehicleColor,
      year: vehicleYear,
      number: vehicleNumber,
      seats: vehicleSeats,
    });

  const token = crypto.randomUUID();
  await db.insert(verificationTokens).values({
    userId: driver.id,
    role: ROLE,
    token,
    type: "email_verify",
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
  });

  await sendVerificationEmail(email, token, ROLE);

  return c.json(
    { message: "Registration successful. Please verify your email.", userId: driver.id },
    201,
  );
});

// POST /login
driverAuth.post("/login", async (c) => {
  const body = await c.req.json();
  const { email, password } = body;

  if (!email || !password) {
    return c.json({ error: "Email and password are required" }, 400);
  }

  const [driver] = await db
    .select()
    .from(users)
    .where(and(eq(users.email, email), eq(users.role, ROLE)))
    .limit(1);

  if (!driver) {
    return c.json({ error: "Invalid email or password" }, 401);
  }

  const valid = await comparePassword(password, driver.passwordHash);
  if (!valid) {
    return c.json({ error: "Invalid email or password" }, 401);
  }

  const accessToken = await signAccessToken(driver.id, driver.email, ROLE);
  const refreshToken = await signRefreshToken(driver.id, driver.email, ROLE);

  await db.insert(refreshTokens).values({
    userId: driver.id,
    role: ROLE,
    token: refreshToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  const driverCars = await db
    .select()
    .from(cars)
    .where(eq(cars.driverId, driver.id));

  return c.json({
    accessToken,
    refreshToken,
    user: {
      id: driver.id,
      email: driver.email,
      name: driver.name,
      phone: driver.phone,
      avatarUrl: driver.avatarUrl,
      rating: driver.rating,
      licenseNumber: driver.licenseNumber,
      isVerified: driver.isVerified,
      cars: driverCars,
    },
  });
});

// POST /logout (protected)
driverAuth.post("/logout", authMiddleware, async (c) => {
  const role = c.get("role");
  if (role !== ROLE) {
    return c.json({ error: "Unauthorized" }, 403);
  }

  const body = await c.req.json();
  const { refreshToken } = body;

  if (refreshToken) {
    await db
      .delete(refreshTokens)
      .where(and(eq(refreshTokens.token, refreshToken), eq(refreshTokens.role, ROLE)));
  }

  return c.json({ message: "Logged out successfully" });
});

// POST /refresh
driverAuth.post("/refresh", async (c) => {
  const body = await c.req.json();
  const { refreshToken } = body;

  if (!refreshToken) {
    return c.json({ error: "Refresh token is required" }, 400);
  }

  let payload;
  try {
    payload = await verifyRefreshToken(refreshToken);
  } catch {
    return c.json({ error: "Invalid or expired refresh token" }, 401);
  }

  if (payload.role !== ROLE) {
    return c.json({ error: "Invalid token for this endpoint" }, 403);
  }

  const [storedToken] = await db
    .select()
    .from(refreshTokens)
    .where(and(eq(refreshTokens.token, refreshToken), eq(refreshTokens.role, ROLE)))
    .limit(1);

  if (!storedToken) {
    return c.json({ error: "Refresh token not found" }, 401);
  }

  if (storedToken.expiresAt < new Date()) {
    await db.delete(refreshTokens).where(eq(refreshTokens.token, refreshToken));
    return c.json({ error: "Refresh token expired" }, 401);
  }

  await db.delete(refreshTokens).where(eq(refreshTokens.token, refreshToken));

  const newAccessToken = await signAccessToken(payload.sub, payload.email, ROLE);
  const newRefreshToken = await signRefreshToken(payload.sub, payload.email, ROLE);

  await db.insert(refreshTokens).values({
    userId: payload.sub,
    role: ROLE,
    token: newRefreshToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  return c.json({
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  });
});

// GET /me (protected)
driverAuth.get("/me", authMiddleware, async (c) => {
  const userId = c.get("userId");
  const role = c.get("role");

  if (role !== ROLE) {
    return c.json({ error: "Unauthorized" }, 403);
  }

  const [driver] = await db
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      phone: users.phone,
      avatarUrl: users.avatarUrl,
      rating: users.rating,
      licenseNumber: users.licenseNumber,
      isVerified: users.isVerified,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!driver) {
    return c.json({ error: "User not found" }, 404);
  }

  const driverCars = await db
    .select()
    .from(cars)
    .where(eq(cars.driverId, userId));

  return c.json({ user: { ...driver, role: ROLE, cars: driverCars } });
});

// POST /verify-email
driverAuth.post("/verify-email", async (c) => {
  const body = await c.req.json();
  const { token } = body;

  if (!token) {
    return c.json({ error: "Token is required" }, 400);
  }

  const [vToken] = await db
    .select()
    .from(verificationTokens)
    .where(and(eq(verificationTokens.token, token), eq(verificationTokens.role, ROLE)))
    .limit(1);

  if (!vToken || vToken.type !== "email_verify") {
    return c.json({ error: "Invalid verification token" }, 400);
  }

  if (vToken.expiresAt < new Date()) {
    await db.delete(verificationTokens).where(eq(verificationTokens.id, vToken.id));
    return c.json({ error: "Verification token expired" }, 400);
  }

  await db
    .update(users)
    .set({ isVerified: true, updatedAt: new Date() })
    .where(eq(users.id, vToken.userId));

  await db.delete(verificationTokens).where(eq(verificationTokens.id, vToken.id));

  return c.json({ message: "Email verified successfully" });
});

// POST /forgot-password
driverAuth.post("/forgot-password", async (c) => {
  const body = await c.req.json();
  const { email } = body;

  if (!email) {
    return c.json({ error: "Email is required" }, 400);
  }

  const [driver] = await db
    .select({ id: users.id })
    .from(users)
    .where(and(eq(users.email, email), eq(users.role, ROLE)))
    .limit(1);

  if (driver) {
    const token = crypto.randomUUID();
    await db.insert(verificationTokens).values({
      userId: driver.id,
      role: ROLE,
      token,
      type: "password_reset",
      expiresAt: new Date(Date.now() + 60 * 60 * 1000),
    });

    await sendPasswordResetEmail(email, token, ROLE);
  }

  return c.json({ message: "If an account with that email exists, a reset link has been sent" });
});

// POST /reset-password
driverAuth.post("/reset-password", async (c) => {
  const body = await c.req.json();
  const { token, password } = body;

  if (!token || !password) {
    return c.json({ error: "Token and new password are required" }, 400);
  }

  if (password.length < 8) {
    return c.json({ error: "Password must be at least 8 characters" }, 400);
  }

  const [vToken] = await db
    .select()
    .from(verificationTokens)
    .where(and(eq(verificationTokens.token, token), eq(verificationTokens.role, ROLE)))
    .limit(1);

  if (!vToken || vToken.type !== "password_reset") {
    return c.json({ error: "Invalid reset token" }, 400);
  }

  if (vToken.expiresAt < new Date()) {
    await db.delete(verificationTokens).where(eq(verificationTokens.id, vToken.id));
    return c.json({ error: "Reset token expired" }, 400);
  }

  const passwordHash = await hashPassword(password);

  await db
    .update(users)
    .set({ passwordHash, updatedAt: new Date() })
    .where(eq(users.id, vToken.userId));

  await db.delete(verificationTokens).where(eq(verificationTokens.id, vToken.id));

  await db.delete(refreshTokens).where(
    and(eq(refreshTokens.userId, vToken.userId), eq(refreshTokens.role, ROLE)),
  );

  return c.json({ message: "Password reset successfully" });
});

export default driverAuth;
