import dotenv from "dotenv";
import { createConnection } from "mysql2/promise";

dotenv.config();

const database = await createConnection({
  host: process.env.LEDGER_DATABASE_HOST || "localhost",
  user: process.env.LEDGER_DATABASE_USER || "dev",
  password: process.env.LEDGER_DATABASE_PASSWORD || "dev",
  database: process.env.LEDGER_DATABASE_NAME || "ledger_dev",
  dateStrings: false,
});

await database.connect();

export default database;

// export let database: Connection;

// export const createDatabaseConnection = async (): Promise<void> => {
//   database = await createConnection({
//     host: process.env.LEDGER_DATABASE_HOST || "localhost",
//     user: process.env.LEDGER_DATABASE_USER || "dev",
//     password: process.env.LEDGER_DATABASE_PASSWORD || "dev",
//     database: process.env.LEDGER_DATABASE_NAME || "ledger_dev",
//   });

//   await database.connect();
// };
