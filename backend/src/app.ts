import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import cors from "cors";

import { sessionMiddleware } from "./session";
import { logRequests } from "./middleware";

import { authRouter } from "./routes/auth";
import { mainRouter } from "./routes/main";
import { chatsRouter } from "./routes/chats";
import { messagesRouter } from "./routes/messages";

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(helmet());
app.use(sessionMiddleware);

if (process.env.ENV !== "prod") {
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
app.use("/main", mainRouter);
app.use("/chats", chatsRouter);
app.use("/messages", messagesRouter);

export default app;
