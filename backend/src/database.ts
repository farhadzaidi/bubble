import dotenv from "dotenv";
import { Connection, createConnection } from "mysql2/promise";

dotenv.config();

export let database: Connection;

export const createDatabaseConnection = async (): Promise<void> => {
  database = await createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
  });

  await database.connect();
};
