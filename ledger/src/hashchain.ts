import crypto from "crypto";
import { Record, PartialRecord } from "./record";

export const computeEntryHash = (record: Record | PartialRecord): string => {
  // Don't include created_at or entry_hash in timestamp
  // entry_hash is not included for obvious reasons
  // created_at is not included since the database sets the timestamp
  const recordString = JSON.stringify({
    id: record.id,
    username: record.username,
    publicKey: record.public_key,
    prevHash: record.prev_hash,
  });

  const entryHash = crypto.createHash("sha256").update(recordString);
  return entryHash.digest("hex");
};

export const checkIntegrity = (records: Record[]): boolean => {
  let prevId: number | null = null;
  let prevTimestamp: Date | null = null;
  let prevHash: string | null = null;

  for (const record of records) {
    // Ensure Ids are consecutive
    if (prevId && prevId + 1 !== record.id) return false;

    // Ensure timestamps are in order
    if (prevTimestamp && prevTimestamp > record.created_at) return false;

    if (record.id !== 1 && prevHash !== record.prev_hash) return false;

    // Ensure entry hash matches
    const entryHash = computeEntryHash(record);
    if (entryHash !== record.entry_hash) return false;

    prevId = record.id;
    prevTimestamp = record.created_at;
    prevHash = record.entry_hash;
  }

  return true;
};
