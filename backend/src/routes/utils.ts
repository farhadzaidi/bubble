import dotenv from "dotenv";
import { Response } from "express";

dotenv.config();

export const handleServerError = (res: Response, error: any): void => {
  res.sendStatus(500);
  if (process.env.ENV !== "prod") {
    throw error;
  }
}

export const status = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  REQUEST_TIMEOUT: 408,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
};
