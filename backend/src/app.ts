import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import cors from "cors";

import { sessionMiddleware } from "./session";
import { handleParseError, logRequests } from "./middleware";

import { authRouter } from "./routes/auth";
import { chatsRouter } from "./routes/chats";
import { messagesRouter } from "./routes/messages";

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(helmet());
app.use(sessionMiddleware);
app.use(handleParseError);

if (process.env.ENV === "prod") {
  // TODO?
} else {
  app.use(logRequests);
  app.use(
    cors({
      origin: "http://localhost:5173",
      credentials: true,
    })
  );
}

// Routers
app.use("/auth", authRouter);
app.use("/chats", chatsRouter);
app.use("/messages", messagesRouter);

// Health Check
app.get("/health", (_req, res) => {
  res.sendStatus(200);
});

export default app;
