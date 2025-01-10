import { Server } from "socket.io";
import { createServer } from "http";
import { createDatabaseConnection } from "./database";
import app from "./app";

const port = Number(process.env.PORT);
const server = createServer(app);
export const io = new Server(server);
await createDatabaseConnection();
server.listen(port, () => {
  console.log(`Server running on port ${port}...`);
});
