import { io } from "./index";

io.on("connection", (socket) => {
  socket.on("message", (message) => {
    console.log(`message: ${message}`);
  });
});
