import crypto from "crypto";
import { IncomingMessage } from "http";
import { Server, Socket } from "socket.io";
import { SessionData } from "express-session";
import server from "./server";
import { sessionMiddleware } from "./session";
import { database } from "./database";
import { RowDataPacket } from "mysql2";

interface SessionSocket extends Socket {
  request: IncomingMessage & {
    session: SessionData & { username?: string };
  };
}

type ClientMessage = {
  chatId: string;
  nonce: string;
  content: string;
};

type ForwardedMessage = {
  message_id: string;
  sender: string;
  nonce: string;
  content: string;
  sent_at: string;
};

const userSockets = new Map<string, SessionSocket>();

const validateSession = (socket: SessionSocket): void => {
  if (!socket.request.session.username) {
    socket.emit("Session is invalid or has expired. Disconnecting...");
    socket.disconnect();
  }
};

const saveMessage = async (
  sender: string,
  message: ClientMessage
): Promise<ForwardedMessage> => {
  const messageId = crypto.randomUUID();
  let query = `INSERT INTO Messages (message_id, chat_id, sender, nonce, content) 
    VALUES (?, ?, ?, ?, ?)`;
  await database.query(query, [
    messageId,
    message.chatId,
    sender,
    message.nonce,
    message.content,
  ]);

  // Query for timestamp
  query = `SELECT sent_at FROM Messages WHERE message_id = ?;`;
  const [result] = await database.query<RowDataPacket[]>(query, [messageId]);

  return {
    message_id: messageId,
    sender,
    nonce: message.nonce,
    content: message.content,
    sent_at: result[0].sent_at,
  };
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

  io.on("connection", async (socket) => {
    const sessionSocket = socket as SessionSocket;
    validateSession(sessionSocket);

    const username = sessionSocket.request.session.username;
    userSockets.set(username, sessionSocket);

    sessionSocket.on("message", async (message: ClientMessage) => {
      validateSession(sessionSocket);
      const forwardedMessage = await saveMessage(username, message);

      // Send message to every client that is currently online
      const chatUsernames = message.chatId.split(":");
      for (const [username, socket] of userSockets) {
        if (chatUsernames.includes(username)) {
          socket.emit("forwardedMessage", forwardedMessage);
        }
      }
    });

    sessionSocket.on("disconnect", async (reason) => {
      userSockets.delete(username);
    });
  });
};
