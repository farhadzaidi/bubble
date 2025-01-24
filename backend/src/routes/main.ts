import { Router } from "express";
import {
  requireSession,
  requireAuthToken,
  verifyUser,
  rejectIfSession,
} from "../middleware";

export const mainRouter = Router();

mainRouter.get("/ping", (_req, res) => {
  res.status(200).json({ message: "pong" });
});

// Test routes

mainRouter.get("/ping-with-session", requireSession, (_req, res) => {
  res.status(200).json({ message: "pong" });
});

mainRouter.get("/ping-with-token", requireAuthToken, (_req, res) => {
  res.status(200).json({ message: "pong" });
});

mainRouter.get("/ping-with-username", verifyUser, (_req, res) => {
  res.status(200).json({ message: "pong" });
});

mainRouter.get("/ping-without-session", rejectIfSession, (_req, res) => {
  res.status(200).json({ message: "pong" });
});
