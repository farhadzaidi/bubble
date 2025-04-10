import { Router } from "express";
import { RowDataPacket } from "mysql2";
import { database } from "../database";
import { requireSession, requireAuthToken, verifyUser } from "../middleware";
import { handleServerError } from "./utils";

export const chatsRouter = Router();
// chatsRouter.use(requireSession);
// chatsRouter.use(requireAuthToken);

type EncryptionKeyType = {
  username: string;
  nonce: string;
  encryptionKey: string;
};

const isValidEncryptionKeyArray = (objectArray: any): boolean => {
  const isEncryptionKey = (object: any): boolean => {
    return (
      typeof object === 'object' &&
      object !== null &&
      typeof object.username === 'string' &&
      typeof object.nonce === 'string' &&
      typeof object.encryptionKey === 'string'
    );
  }

  return Array.isArray(objectArray) && objectArray.every(isEncryptionKey);
}

const createChatId = (encryptionKeys: EncryptionKeyType[]) => {
  const usernames = encryptionKeys.map((info) => info.username);
  return usernames.sort().join(":");
};

chatsRouter.get("/get-chats-by-user", verifyUser, async (req, res) => {
  const username = req.query.username;
  const query = `
    SELECT UC.chat_id, C.chat_name, C.creator, UC.joined
    FROM UserChats UC
    JOIN Chats C ON UC.chat_id = C.chat_id
    JOIN Users U ON UC.username = U.username
    WHERE U.username = ?;
  `;

  let result: RowDataPacket[];
  try {
    [result] = await database.query<RowDataPacket[]>(query, [username]);
  } catch (error) {
    handleServerError(res, error);
    return;
  }

  res.status(200).json(result);
});

chatsRouter.post("/create-chat", verifyUser, async (req, res) => {
  // Extract info
  const encryptionKeys: EncryptionKeyType[] = req.body.encryptionKeys;
  if (!isValidEncryptionKeyArray(encryptionKeys)) {
    res.status(400).json({ error: "Invalid encryption keys array" });
    return;
  }

  const creator = req.query.username as string;
  const chatId: string = createChatId(encryptionKeys);
  const chatName: string = chatId; // TODO

  // Create chat
  let query = `INSERT INTO Chats (chat_id, chat_name, creator) VALUES (?, ?, ?)`;
  try {
    await database.query(query, [chatId, chatName, creator]);
  } catch (error: any) {
    if (error?.code == "ER_DUP_ENTRY") {
      res.status(409).json({ error: "Chat with these members already exists" });
      return;
    } else {
      handleServerError(res, error);
      return;
    }
  }

  // Create UserChats table for each user
  const userChats = encryptionKeys.map((info) => [
    info.username,
    chatId,
    false,
    info.nonce,
    info.encryptionKey,
  ]);

  query = `INSERT INTO UserChats (username, chat_id, joined, nonce, encryption_key) VALUES ?`;
  try {
    await database.query(query, [userChats]);
  } catch (error: any) {
    handleServerError(res, error);
    return;
  }

  // Modify creator's UserChats table to set "joined" attribute to true since
  // the creator automatically joins the chat
  query = `UPDATE UserChats SET joined=true WHERE username=? AND chat_id=?`;
  try {
    await database.query(query, [creator, chatId]);
  } catch (error: any) {
    handleServerError(res, error);
    return;
  }

  res.status(200).json({});
});

chatsRouter.post("/accept-chat-invite", verifyUser, async (req, res) => {
  const username = req.query.username as string;
  const chatId: string = req.body.chatId;

  const query = `UPDATE UserChats SET joined=true WHERE username = ? AND chat_id = ?`;
  await database.query(query, [username, chatId]);
  res.sendStatus(200);
});

chatsRouter.post("/decline-chat-invite", verifyUser, async (req, res) => {
  const username = req.query.username as string;
  const chatId: string = req.body.chatId;

  const query = `DELETE FROM UserChats WHERE username = ? AND chat_id = ?`;
  await database.query(query, [username, chatId]);
  res.sendStatus(200);
});

chatsRouter.post("/get-encryption-key", async (req, res) => {
  const username = req.query.username as string;
  const chatId: string = req.body.chatId;

  const query = `SELECT nonce, encryption_key FROM UserChats WHERE username = ? AND chat_id = ?`;
  let result: RowDataPacket[];
  try {
    [result] = await database.query<RowDataPacket[]>(query, [username, chatId,]);
  } catch (error: any) {
    handleServerError(res, error);
    return;
  }


  if (result.length === 0) {
    res.status(404).json({
      error: "Failed to find encryption key for provided username and chat ID",
    });
    return;
  }

  res.status(200).json({ nonce: result[0].nonce, encryptionKey: result[0].encryption_key });
});

chatsRouter.get("/get-chat-creator", async (req, res) => {
  const chatId: string = req.query.chatId as string;

  const query = `SELECT creator FROM Chats WHERE chat_id = ?`;
  let result: RowDataPacket[]
  try {
    [result] = await database.query<RowDataPacket[]>(query, [chatId]);
  } catch (error) {
    handleServerError(res, error);
    return;
  }

  if (result.length === 0) {
    res.status(404).json({
      error: "Failed to find chat creator with provided chat ID",
    });
  }

  res.status(200).json({ creator: result[0].creator });
});
