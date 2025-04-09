// Database-level delete event already exists, but this is exists as a backup
// Additionally, in the future we might want dynamic/customizable TTLS

import { database } from "./database";

// In milliseconds
const CLEANER_INTERVAL = 24 * 60 * 60 * 1000;

// MySQL interval format
const MESSAGE_TTL = "24 HOUR";

export const deleteExpiredMessages = async (
  cleanerInterval = CLEANER_INTERVAL,
  messageTTL = MESSAGE_TTL
) => {
  const query = `DELETE FROM Messages WHERE sent_at < NOW() - INTERVAL ${messageTTL};`;
  await database.query(query);
  setInterval(deleteExpiredMessages, cleanerInterval);
};
