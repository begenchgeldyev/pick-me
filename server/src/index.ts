import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import passengerAuth from "./routes/passenger";
import driverAuth from "./routes/driver";

const app = new Hono();

app.use("*", logger());
app.use("*", cors());

app.route("/api/passenger/auth", passengerAuth);
app.route("/api/driver/auth", driverAuth);

app.get("/", (c) => c.json({ message: "PickMe API is running" }));

const port = Number(process.env.PORT) || 3000;

console.log(`Server starting on port ${port}`);

export default {
  port,
  fetch: app.fetch,
};
