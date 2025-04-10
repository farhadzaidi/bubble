import dotenv from "dotenv";
import redis from "../redis";
import { Router, Request, Response } from "express";
import { RowDataPacket } from "mysql2";
import { database } from "../database";
import { rejectIfSession, requireSession } from "../middleware";
import { generateAuthToken, createChallenge, verifyChallenge } from "../crypto";
import { status, handleServerError } from "./utils";

dotenv.config();

export const authRouter = Router();

// HELPER FUNCTIONS

const regenerateSessionandIssueToken = (
  req: Request,
  res: Response,
  username: string
): void => {
  req.session.regenerate(() => {
    req.session.username = username;
    res.status(status.OK).json({ token: generateAuthToken(username) });
  });
};

// ENDPOINTS

authRouter.post(
  "/request-challenge",
  rejectIfSession,
  async (req, res): Promise<void> => {
    const username: string = req.body.username;
    if (username === undefined) {
      res.status(status.BAD_REQUEST).json({ error: "Missing username" });
      return;
    }

    // Check if user exists and retrieve salt and public key
    const query = `SELECT salt, public_key FROM Users WHERE username=?;`;
    let result: RowDataPacket[];
    try {
      [result] = await database.query<RowDataPacket[]>(query, [username]);
    } catch (error: any) {
      handleServerError(res, error);
      return;
    }

    if (result.length === 0) {
      res.status(status.UNAUTHORIZED).json({ error: "Invalid credentials" });
      return;
    }

    const challenge = createChallenge();
    redis.hset(
      `challenge:${username}`,
      "challenge",
      challenge,
      "publicKey",
      result[0].public_key
    );
    redis.expire(`challenge:${username}`, 5);
    res.status(status.OK).json({ salt: result[0].salt, challenge: challenge });
  }
);

authRouter.post(
  "/verify-challenge",
  rejectIfSession,
  async (req, res): Promise<void> => {
    const username: string = req.body.username;
    const signature: string = req.body.signature;
    if (username === undefined || signature === undefined) {
      res.status(status.BAD_REQUEST).json({ error: "Missing username or signature" });
      return;
    }

    const challengeExists = await redis.exists(`challenge:${username}`);
    if (!challengeExists) {
      res.status(status.REQUEST_TIMEOUT).json({ error: "Challenge expired or doesn't exist" });
      return;
    }

    const challenge = await redis.hget(`challenge:${username}`, "challenge");
    const publicKey = await redis.hget(`challenge:${username}`, "publicKey");
    const isValid = verifyChallenge(
      challenge as string,
      signature,
      publicKey as string
    );

    if (isValid) {
      regenerateSessionandIssueToken(req, res, username);
      return;
    }

    res.status(status.UNAUTHORIZED).json({ error: "Invalid credentials" });
  }
);

authRouter.post(
  "/sign-up",
  rejectIfSession,
  async (req, res): Promise<void> => {
    const username: string = req.body.username;
    const salt: string = req.body.salt;
    const publicKey: string = req.body.publicKey;

    // Server-side username validation
    // This should already be done on the client, but it is still needed
    // in case client-side code has been modified
    if (
      username === undefined
      || username.length > 16
      || !/^[a-zA-Z0-9]*$/.test(username)
    ) {
      res.status(status.BAD_REQUEST).json({ error: "Invalid username" })
      return;
    }

    // Check if username is available
    let query = `SELECT username FROM Users WHERE username=?;`;
    let result: RowDataPacket[];
    try {
      [result] = await database.query<RowDataPacket[]>(query, [username]);
    } catch (error: any) {
      handleServerError(res, error);
      return;
    }

    if (result.length > 0) {
      res.status(status.CONFLICT).json({ error: "Username already exists" });
      return;
    }

    // Store record in the database
    query = `INSERT INTO Users (username, salt, public_key) VALUES (?, ?, ?);`;
    try {
      await database.query(query, [username, salt, publicKey]);
    } catch (error: any) {
      handleServerError(res, error);
      return;
    }

    // Success
    regenerateSessionandIssueToken(req, res, username);
  }
);

authRouter.post("/sign-out", async (req, res): Promise<void> => {
  if (!req.session.username) {
    res.sendStatus(status.FORBIDDEN);
    return;
  }

  req.session.destroy((error) => {
    if (error !== null) console.debug(error);
  });
  res.clearCookie("connect.sid");
  res.status(status.OK).json({ message: "Sign out successful" });
});

// Regenerate auth token
authRouter.post("/get-token", requireSession, (req, res): void => {
  res.status(status.OK).json({
    token: generateAuthToken(req.session.username as string),
  });
});

// Returns the username if the session is valid, otherwise returns an empty body
authRouter.post("/check-session", (req, res): void => {
  if (req.session && req.session.username) {
    res.status(status.OK).json({ username: req.session.username });
  } else res.status(status.OK).json({});
});
