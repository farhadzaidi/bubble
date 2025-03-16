import { Router } from "express";
import { RowDataPacket } from "mysql2";
import { database } from "../database";
import { requireSession, requireAuthToken, verifyUser } from "../middleware";

export const chatsRouter = Router();
chatsRouter.use(requireSession);
chatsRouter.use(requireAuthToken);

chatsRouter.get("/get-chats-by-user", verifyUser, async (req, res) => {
  const username = req.query.username;
  const query = `
    SELECT UC.chat_id, C.chat_name
    FROM UserChats UC
    JOIN Chats C ON UC.chat_id = C.chat_id
    JOIN Users U ON UC.username = U.username
    WHERE U.username = ?;
  `;
  const [result] = await database.query<RowDataPacket[]>(query, [username]);
  res.status(200).json(result);
});

chatsRouter.post("/create-chat", async (req, res) => {
  // userInfo array (user will also provide their own)
  // - username
  // - encrypted symmetric encryption key
  const userInfo = JSON.parse(req.body.userInfo);

  // create Chats entry
  // create UserChats entry for each user with joined = false
});
