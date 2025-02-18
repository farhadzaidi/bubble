import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import database from "./database";
import { checkIntegrity, computeEntryHash } from "./hashchain";

import { RowDataPacket } from "mysql2";
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

// Routes
app.post("/get-public-keys", async (req, res) => {
  // Ensure the hash chain is intact
  let query = `SELECT * FROM PublicKeys ORDER BY id ASC;`;
  let [result] = await database.query<RowDataPacket[]>(query);

  const isValid = checkIntegrity(result as Record[]);
  if (!isValid) {
    res.status(422).json({ error: "Hash chain integrity check failed." });
    return;
  }

  // If the hash chain is intact we can now fetch the public keys
  const usernames: string[] = req.body.usernames;
  const placeholders = usernames.map(() => "?").join(", ");
  query = `SELECT username, public_key FROM PublicKeys WHERE username IN (${placeholders})`;
  [result] = await database.query<RowDataPacket[]>(query, usernames);
  res.status(200).json(result);
});

app.post("/submit-public-key", async (req, res) => {
  const { username, publicKey } = req.body;

  let query = `SELECT id, entry_hash FROM PublicKeys ORDER BY id DESC LIMIT 1;`;
  const [result] = await database.query<RowDataPacket[]>(query);

  let prevHash: string | null = null;
  let prevId: number = 0;
  if (result.length !== 0) {
    prevHash = result[0].entry_hash;
    prevId = result[0].id;
  }

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
  await database.query<RowDataPacket[]>(query, [
    username,
    publicKey,
    entryHash,
    prevHash,
  ]);

  res.status(200).json({ message: "Public Key submission successful." });
});

// Start server
const port = Number(process.env.PORT) || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}...`);
});
