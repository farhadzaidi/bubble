import { Server, Socket } from "socket.io";
import server from "./server";
import { sessionMiddleware } from "./session";
import { SessionData } from "express-session";

const validateSession = (socket: Socket): void => {
  if (
    !("session" in socket.request) ||
    !("username" in (socket.request.session as SessionData))
  ) {
    socket.emit("Session is invalid or has expired. Disconnecting...");
    socket.disconnect();
  }
};

export const createChatServer = () => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.engine.use(sessionMiddleware);

  io.on("connection", (socket) => {
    validateSession(socket);
    socket.on("message", (message) => {
      validateSession(socket);
    });
  });
};
