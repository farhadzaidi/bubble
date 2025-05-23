import dotenv from "dotenv";
import { createConnection } from "mysql2/promise";

dotenv.config();

const database = await createConnection({
  host: process.env.LEDGER_DATABASE_HOST || "localhost",
  user: process.env.LEDGER_DATABASE_USER || "dev",
  password: process.env.LEDGER_DATABASE_PASSWORD || "dev",
  database: process.env.LEDGER_DATABASE_NAME || "bubble",
  port: Number(process.env.BUBBLE_DATABASE_PORT) || 3307, // Docker Container Port
  dateStrings: false,
  timezone: 'Z', // UTC
});

await database.connect();

export default database;