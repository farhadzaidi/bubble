import crypto from "crypto";

export class Payload {
  type: string;

  constructor(type: string = "") {
    this.type = type;
  }
}

export class MessagePayload extends Payload {
  id: string;
  chatId: string;
  sender: string;
  content: string;
  timestamp: number;

  constructor(chatId: string, sender: string, content: string) {
    super("MESSAGE");
    this.id = crypto.randomUUID().toString();
    this.chatId = chatId;
    this.sender = sender;
    this.content = content;
    this.timestamp = Date.now();
  }
}

import { Server, Socket } from "socket.io";
import { server } from "./server";
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
