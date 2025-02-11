import dotenv from "dotenv";
import redis from "../redis";
import { Router, Request, Response } from "express";
import { RowDataPacket } from "mysql2";
import { database } from "../database";
import { rejectIfSession, requireSession } from "../middleware";
import { generateAuthToken, createChallenge, verifyChallenge } from "../crypto";

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
    res.status(200).json({ token: generateAuthToken(username) });
  });
};

// ENDPOINTS

authRouter.post(
  "/request-challenge",
  rejectIfSession,
  async (req, res): Promise<void> => {
    const username: string = req.body.username;

    // Check if user exists and retrieve salt and public key
    const query = `SELECT salt, public_key FROM Users WHERE username=?;`;
    const [result] = await database.query<RowDataPacket[]>(query, [username]);

    if (result.length === 0) {
      res.status(401).json({ error: "Invalid credentials" });
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
    res.status(200).json({ salt: result[0].salt, challenge: challenge });
  }
);

authRouter.post(
  "/verify-challenge",
  rejectIfSession,
  async (req, res): Promise<void> => {
    const username: string = req.body.username;
    const signature: string = req.body.signature;

    if (!redis.exists(`challenge:${username}`)) {
      res.status(408).json({ error: "Challenge expired." });
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

    res.status(401).json({ error: "Invalid credentials" });
  }
);

authRouter.post(
  "/sign-up",
  rejectIfSession,
  async (req, res): Promise<void> => {
    const username: string = req.body.username;
    const salt: string = req.body.salt;
    const publicKey: string = req.body.publicKey;

    // Check if username is available
    let query = `SELECT username FROM Users WHERE username=?;`;
    const [result] = await database.query<RowDataPacket[]>(query, [username]);
    if (result.length > 0) {
      res.status(409).json({
        error: "Username already exists",
      });
      return;
    }

    // Store record in the database
    query = `INSERT into Users (username, salt, public_key) values (?, ?, ?);`;
    await database.query(query, [username, salt, publicKey]);

    // Success
    regenerateSessionandIssueToken(req, res, username);
  }
);

authRouter.post("/sign-out", async (req, res): Promise<void> => {
  if (req.session) {
    req.session.destroy((error) => {
      if (error !== null) console.debug(error);
    });
  }
  res.clearCookie("connect.sid");
  res.status(200).json({ message: "Sign out successful" });
});

// Regenerate auth token
authRouter.post("/get-token", requireSession, (req, res): void => {
  res.status(200).json({
    token: generateAuthToken(req.session.username as string),
  });
});

// Returns the username if the session is valid, otherwise returns an empty body
authRouter.post("/check-session", (req, res): void => {
  if (req.session && req.session.username) {
    res.status(200).json({ username: req.session.username });
  } else res.status(200).json({});
});
