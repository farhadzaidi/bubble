import { server } from "./server";
import { createChatServer } from "./chat";
import { createDatabaseConnection } from "./database";

createChatServer();
await createDatabaseConnection();

const port = Number(process.env.PORT);
server.listen(port, () => {
  console.log(`Server running on port ${port}...`);
});
