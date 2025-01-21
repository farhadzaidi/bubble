import dotenv from "dotenv";
import session from "express-session";
import Redis from "ioredis";
import connectRedis from "connect-redis";
import { RequestHandler } from "express";

dotenv.config();

// Set up session data to store username
declare module "express-session" {
  export interface SessionData {
    username: string;
  }
}

// Initialize redis client
export const redisClient = new Redis(process.env.REDIS_URL as string);

export const createSessionStore = (): RequestHandler => {
  // Configure Redis for storing sessions
  const RedisStore = connectRedis(session);
  return session({
    store: new RedisStore({ client: redisClient }),
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
    // rolling: true,
    cookie: {
      secure: process.env.ENV == "prod",
      httpOnly: true,
      sameSite: "strict",
      // maxAge: 1000 * 60 * 15, // 15 minute
    },
  });
};
