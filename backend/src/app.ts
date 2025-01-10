import express from "express";
import helmet from "helmet";
import cors from "cors";

import { createSessionStore } from "./session";
import { logRequests } from "./middleware";

import { authRouter } from "./routes/auth";
import { mainRouter } from "./routes/main";
import { chatsRouter } from "./routes/chats";

const app = express();

// Middleware
app.use(express.json());
app.use(helmet());
app.use(createSessionStore());
app.use(logRequests);
if (process.env.ENV === "dev") app.use(cors());

// Routers
app.use("/auth", authRouter);
app.use("/main", mainRouter);
app.use("/chats", chatsRouter);

export default app;
