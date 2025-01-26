import { Router } from "express";
import { RowDataPacket } from "mysql2";
import { database } from "../database";
import { requireSession, requireAuthToken } from "../middleware";

export const messagesRouter = Router();
messagesRouter.use(requireSession);
messagesRouter.use(requireAuthToken);

messagesRouter.get("/get-messages-by-chat", async (req, res) => {
  const chatId = req.query.chatId;
  const query = `
    SELECT M.message_id, M.sender, M.content, M.sent_at
    FROM Messages M
    JOIN Chats C ON C.chat_id = M.chat_id
    WHERE C.chat_id = ?;
  `;
  const [result] = await database.query<RowDataPacket[]>(query, [chatId]);
  res.status(200).json(result);
});
