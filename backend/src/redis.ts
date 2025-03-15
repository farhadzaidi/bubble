import dotenv from "dotenv";
import Redis from "ioredis";

dotenv.config();

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6380");

export default redis;
