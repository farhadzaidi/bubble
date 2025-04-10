import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import database from "./database";
import { status } from "./status";
import { checkIntegrity, computeEntryHash } from "./hashchain";
import { RowDataPacket } from "mysql2";
import { Response } from "express";
import { Record, PartialRecord } from "./record";

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(helmet());
if (process.env.ENV !== "prod") {
  app.use(
    cors({
      origin: "http://localhost:5173",
      credentials: true,
    })
  );
}

// HELPERS

const handleServerError = (res: Response, error: unknown): void => {
  res.sendStatus(status.INTERNAL_SERVER_ERROR);
  if (process.env.ENV !== "prod") {
    throw error;
  }
}

// Routes
app.post("/get-public-keys", async (req, res) => {
  // Ensure the hash chain is intact
  let query = `SELECT * FROM PublicKeys ORDER BY id ASC;`;
  let result: RowDataPacket[];
  try {
    [result] = await database.query<RowDataPacket[]>(query);
  } catch (error: any) {
    handleServerError(res, error);
    return;
  }

  const isValid = checkIntegrity(result as Record[]);
  if (!isValid) {
    res.status(status.UNPROCESSABLE_ENTITY).json({ error: "Hash chain integrity check failed." });
    return;
  }

  // If the hash chain is intact we can now fetch the public keys

  // Validate input
  const usernames: string[] = req.body.usernames;
  const isValidUsernamesArray = Array.isArray(usernames) &&
    usernames.every(item => typeof item === 'string');
  if (!isValidUsernamesArray) {
    res.status(status.BAD_REQUEST).json({ error: "Invalid usernames array" });
  }

  const placeholders = usernames.map(() => "?").join(", ");
  query = `SELECT username, public_key FROM PublicKeys WHERE username IN (${placeholders})`;
  try {
    [result] = await database.query<RowDataPacket[]>(query, usernames);
  } catch (error: any) {
    handleServerError(res, error);
    return;
  }

  res.status(status.OK).json(result);
});

app.post("/submit-public-key", async (req, res) => {
  // Get previous entry
  let query = `SELECT id, entry_hash FROM PublicKeys ORDER BY id DESC LIMIT 1;`;
  let result: RowDataPacket[];
  try {
    [result] = await database.query<RowDataPacket[]>(query);
  } catch (error: any) {
    handleServerError(res, error);
    return;
  }

  let prevHash: string | null = null;
  let prevId: number = 0;
  if (result.length !== 0) {
    prevHash = result[0].entry_hash;
    prevId = result[0].id;
  }

  const username: string = req.body.username;
  const publicKey: string = req.body.username;

  // Create a partial record to compute the entry hash before inserting into
  // the database
  const partialRecord: PartialRecord = {
    id: prevId + 1,
    username,
    public_key: publicKey,
    prev_hash: prevHash,
  };

  // Compute the hash of the partial record and insert into the database
  const entryHash = computeEntryHash(partialRecord);
  query = `INSERT INTO PublicKeys (username, public_key, entry_hash, prev_hash) VALUES (?, ?, ?, ?);`;
  try {
    await database.query<RowDataPacket[]>(query, [
      username,
      publicKey,
      entryHash,
      prevHash,
    ]);
  } catch (error: any) {
    if (error.code === "ER_DUP_ENTRY") {
      res.status(status.CONFLICT).json({ error: "Public Key already exists." });
      return;
    } else {
      handleServerError(res, error);
      return;
    }
  }

  res.status(status.OK).json({ message: "Public Key submission successful." });
});

// Start server
const port = Number(process.env.PORT) || 3001;
app.listen(port, () => {
  console.log(`Server running on port ${port}...`);
});
