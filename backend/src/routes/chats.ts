import { Router } from "express";
import { RowDataPacket } from "mysql2";
import { database } from "../database";
import { requireSession, requireAuthToken, verifyUser } from "../middleware";

export const chatsRouter = Router();
chatsRouter.use(requireSession);
chatsRouter.use(requireAuthToken);

type EncryptionKeyType = {
  username: string;
  nonce: string;
  encryptionKey: string;
};

const createChatId = (encryptionKeys: EncryptionKeyType[]) => {
  const usernames = encryptionKeys.map((info) => info.username);
  return usernames.sort().join(":");
};

chatsRouter.get("/get-chats-by-user", verifyUser, async (req, res) => {
  const username = req.query.username;
  const query = `
    SELECT UC.chat_id, C.chat_name, UC.joined
    FROM UserChats UC
    JOIN Chats C ON UC.chat_id = C.chat_id
    JOIN Users U ON UC.username = U.username
    WHERE U.username = ?;
  `;
  const [result] = await database.query<RowDataPacket[]>(query, [username]);
  res.status(200).json(result);
});

chatsRouter.post("/create-chat", verifyUser, async (req, res) => {
  // Extract info
  const encryptionKeys: EncryptionKeyType[] = req.body.encryptionKeys;
  const chatId = createChatId(encryptionKeys);
  const chatName = chatId; // TODO

  // Create chat
  let query = `INSERT INTO Chats (chat_id, chat_name) VALUES (?, ?)`;
  try {
    await database.query(query, [chatId, chatName]);
  } catch (error: any) {
    if (error?.code == "ER_DUP_ENTRY") {
      res
        .status(409)
        .json({ error: "Chat with these members already exists." });
    }
    throw error;
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
  await database.query(query, [userChats]);

  // Modify sender's UserChats table to set "joined" attribute to true since
  // the sender (creator of the chat) automatically joins the chat
  query = `UPDATE UserChats SET joined=true WHERE username=?`;
  await database.query(query, [req.query?.username]);

  res.status(200).json({});
});
