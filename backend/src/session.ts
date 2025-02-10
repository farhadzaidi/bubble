import dotenv from "dotenv";
import session from "express-session";
import connectRedis from "connect-redis";
import redis from "./redis";

dotenv.config();

// Set up session data to store username
declare module "express-session" {
  export interface SessionData {
    username: string;
  }
}

// Initialize redis store for storing sessions
const RedisStore = connectRedis(session);

export const sessionMiddleware = session({
  store: new RedisStore({ client: redis }),
  secret: process.env.SESSION_SECRET || "session_secret",
  resave: false,
  saveUninitialized: false,
  // rolling: true,
  cookie: {
    secure: process.env.ENV === "prod",
    httpOnly: true,
    sameSite: "strict",
    // maxAge: 1000 * 60 * 15, // 15 minute
  },
});
