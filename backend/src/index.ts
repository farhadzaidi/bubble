import server from "./server";
import { createChatServer } from "./chat";
import { createDatabaseConnection } from "./database";
import { deleteExpiredMessages } from "./cleaner";

createChatServer();
await createDatabaseConnection();
deleteExpiredMessages(); // Background job, no need to await

const port = Number(process.env.PORT) || 3000;
server.listen(port, () => {
  console.log(`Server running on port ${port}...`);
});
