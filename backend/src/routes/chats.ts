import { Router, Request, Response } from "express";
import { RowDataPacket } from "mysql2";
import { database } from "../database";
import {
  requireSession,
  requireAuthToken,
  authenticateUser,
} from "../middleware";

export const chatsRouter = Router();
chatsRouter.use(requireSession);
chatsRouter.use(requireAuthToken);

chatsRouter.get("/get-chats-by-user", authenticateUser, (req, res) => {
  // TODO
});
