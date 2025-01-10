import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Router, Request, Response } from "express";
import { RowDataPacket } from "mysql2";
import { database } from "../database";
import { rejectIfSession, requireSession } from "../middleware";

dotenv.config();

export const authRouter = Router();
const AUTH_TOKEN_TTL = "1m";

// HELPER FUNCTIONS

const generateAuthToken = (username: string) => {
  return jwt.sign({ username }, process.env.JWT_SECRET as jwt.Secret, {
    expiresIn: AUTH_TOKEN_TTL,
  });
};

const regenerateSessionandIssueToken = (
  req: Request,
  res: Response,
  username: string
): void => {
  req.session.regenerate(() => {
    req.session.username = username;
    res.status(200).json({ token: generateAuthToken(username) });
  });
};

// ENDPOINTS

// Authenticate user credentials
authRouter.post(
  "/sign-in",
  rejectIfSession,
  async (req, res): Promise<void> => {
    const username: string = req.body.username;
    const password: string = req.body.password;

    // Check if username exists in the database
    let query = `SELECT username, password_hash FROM Users WHERE username=?;`;
    const [result] = await database.query<RowDataPacket[]>(query, [username]);

    if (result.length === 0) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    // Compare password to hash
    const passwordHash = result[0].password_hash;
    const isMatch = await bcrypt.compare(password, passwordHash);
    if (!isMatch) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    // Success
    regenerateSessionandIssueToken(req, res, username);
  }
);

// Create a new user in the database
authRouter.post(
  "/sign-up",
  rejectIfSession,
  async (req, res): Promise<void> => {
    const username: string = req.body.username;
    const password: string = req.body.password;

    // Check if username is available
    let query = `SELECT username FROM Users WHERE username=?;`;
    const [result] = await database.query<RowDataPacket[]>(query, [username]);
    if (result.length > 0) {
      res.status(409).json({
        error: "Username already exists",
      });
      return;
    }

    // Store username and hashed password in the database
    const passwordHash = await bcrypt.hash(password, 11);
    query = `INSERT into Users (username, password_hash) values (?, ?);`;
    await database.query(query, [username, passwordHash]);

    // Success
    regenerateSessionandIssueToken(req, res, username);
  }
);

authRouter.post(
  "/sign-out",
  requireSession,
  async (req, res): Promise<void> => {
    req.session.destroy((error) => {
      if (error !== null) console.log(error);
    });
    res.clearCookie("connect.sid");
    res.status(200).json({ message: "Sign out successful" });
  }
);

// Regenerate auth token
authRouter.post("/get-token", requireSession, (req, res): void => {
  res.status(200).json({
    token: generateAuthToken(req.session.username as string),
  });
});

authRouter.get("/me", (req, res): void => {
  let isValidSession = false;
  if (req.session && req.session.id && req.session.username)
    isValidSession = true;
  res.status(200).json({ isValidSession });
});
