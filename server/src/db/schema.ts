import {
  pgTable,
  uuid,
  varchar,
  boolean,
  integer,
  real,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

// User (base for Passenger & Driver)
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  avatarUrl: varchar("avatar_url", { length: 500 }),
  rating: real("rating").default(0).notNull(),
  isVerified: boolean("is_verified").default(false).notNull(),
  role: varchar("role", { length: 20 }).notNull().default("passenger"), // 'passenger' | 'driver'
  licenseNumber: varchar("license_number", { length: 50 }), // driver only
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Car
export const cars = pgTable("cars", {
  id: uuid("id").defaultRandom().primaryKey(),
  driverId: uuid("driver_id").references(() => users.id).notNull(),
  brand: varchar("brand", { length: 100 }).notNull(),
  model: varchar("model", { length: 100 }).notNull(),
  year: integer("year").notNull(),
  color: varchar("color", { length: 50 }).notNull(),
  number: varchar("number", { length: 50 }).notNull(),
  seats: integer("seats").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Trip
export const trips = pgTable("trips", {
  id: uuid("id").defaultRandom().primaryKey(),
  driverId: uuid("driver_id").references(() => users.id).notNull(),
  carId: uuid("car_id").references(() => cars.id).notNull(),
  departure: varchar("departure", { length: 255 }).notNull(),
  destination: varchar("destination", { length: 255 }).notNull(),
  departureTime: timestamp("departure_time").notNull(),
  estimArrTime: timestamp("estim_arr_time").notNull(),
  pricePerSeat: real("price_per_seat").notNull(),
  seats: integer("seats").notNull(),
  allowSmoking: boolean("allow_smoking").default(false).notNull(),
  allowLuggage: boolean("allow_luggage").default(false).notNull(),
  status: varchar("status", { length: 20 }).notNull(), // TripStatus
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Booking
export const bookings = pgTable("bookings", {
  id: uuid("id").defaultRandom().primaryKey(),
  tripId: uuid("trip_id").references(() => trips.id).notNull(),
  passengerId: uuid("passenger_id").references(() => users.id).notNull(),
  seatsBooked: integer("seats_booked").notNull(),
  totalPrice: real("total_price").notNull(),
  status: varchar("status", { length: 20 }).notNull(), // BookingStatus
  confirmedAt: timestamp("confirmed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Review (0..2 per booking: passenger reviews driver, driver reviews passenger)
export const reviews = pgTable("reviews", {
  id: uuid("id").defaultRandom().primaryKey(),
  bookingId: uuid("booking_id").references(() => bookings.id).notNull(),
  reviewerId: uuid("reviewer_id").references(() => users.id).notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Message (within a booking conversation)
export const messages = pgTable("messages", {
  id: uuid("id").defaultRandom().primaryKey(),
  bookingId: uuid("booking_id").references(() => bookings.id).notNull(),
  senderId: uuid("sender_id").references(() => users.id).notNull(),
  content: text("content").notNull(),
  sentAt: timestamp("sent_at").defaultNow().notNull(),
  isRead: boolean("is_read").default(false).notNull(),
});

// Notification
export const notifications = pgTable("notifications", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  type: varchar("type", { length: 50 }).notNull(), // NotificationType
  isRead: boolean("is_read").default(false).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Auth: Refresh Tokens
export const refreshTokens = pgTable("refresh_tokens", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  role: varchar("role", { length: 20 }).notNull(),
  token: varchar("token", { length: 255 }).unique().notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Auth: Verification Tokens
export const verificationTokens = pgTable("verification_tokens", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  role: varchar("role", { length: 20 }).notNull(),
  token: varchar("token", { length: 255 }).unique().notNull(),
  type: varchar("type", { length: 20 }).notNull(), // 'email_verify' | 'password_reset'
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
