import dotenv from "dotenv";
import { Connection, createConnection } from "mysql2/promise";

dotenv.config();

export let database: Connection;

export const createDatabaseConnection = async (): Promise<void> => {
  database = await createConnection({
    host: process.env.BUBBLE_DATABASE_HOST || "localhost",
    user: process.env.BUBBLE_DATABASE_USER || "dev",
    password: process.env.BUBBLE_DATABASE_PASSWORD || "dev",
    database: process.env.BUBBLE_DATABASE_NAME || "bubble",
    timezone: 'Z', // UTC
    port: Number(process.env.BUBBLE_DATABASE_PORT) || 3307, // Docker Container Port
  });

  await database.connect();
};
