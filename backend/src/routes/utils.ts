import dotenv from "dotenv";
import { Response } from "express";

dotenv.config();

export const handleServerError = (res: Response, error: unknown): void => {
  res.sendStatus(500);
  if (process.env.ENV !== "prod") {
    throw error;
  }
}
