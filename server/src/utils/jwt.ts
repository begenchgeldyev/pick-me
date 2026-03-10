import { sign, verify } from "hono/jwt";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

const ACCESS_EXPIRY = 15 * 60; // 15 minutes in seconds
const REFRESH_EXPIRY = 7 * 24 * 60 * 60; // 7 days in seconds

export interface TokenPayload {
  sub: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

export async function signAccessToken(userId: string, email: string, role: string): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  return sign(
    { sub: userId, email, role, iat: now, exp: now + ACCESS_EXPIRY },
    ACCESS_SECRET,
  );
}

export async function signRefreshToken(userId: string, email: string, role: string): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  return sign(
    { sub: userId, email, role, iat: now, exp: now + REFRESH_EXPIRY },
    REFRESH_SECRET,
  );
}

export async function verifyAccessToken(token: string): Promise<TokenPayload> {
  return (await verify(token, ACCESS_SECRET, "HS256")) as TokenPayload;
}

export async function verifyRefreshToken(token: string): Promise<TokenPayload> {
  return (await verify(token, REFRESH_SECRET, "HS256")) as TokenPayload;
}
