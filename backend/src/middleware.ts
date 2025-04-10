import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { ErrorRequestHandler, Request, Response, NextFunction } from "express";

dotenv.config();

// For protected routes that require a valid session
export const requireSession = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Ensure that session is valid
  if (!req.session || !req.session.username) {
    res.status(401).json({ error: "Invalid or expired session" });
    return;
  }
  next();
};

// For protected routes that require a valid auth token
export const requireAuthToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Ensure auth header is present and valid
  const authHeader = req.headers?.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(400).json({ error: "Missing or malformed auth header" });
    return;
  }

  // Ensure JWT is valid
  const token = authHeader.split(" ")[1];
  let isValidToken = true;
  const secret = process.env.JWT_SECRET || "jwt_secret";
  jwt.verify(token, secret, (error) => {
    if (error) {
      isValidToken = false;
      res.status(401).json({ error: "Invalid or expired auth token" });
    }
  });

  if (isValidToken) next();
};

// For protected routes where information is requested by username
// Ensures the session username matches the username provided in the query paramters
// Assumes requireSession was already called
export const verifyUser = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const username = req.query?.username;
  if (!username || username !== req.session.username) {
    res.status(403).json({ error: "Missing or invalid username in query" });
    return;
  }

  // Request is valid
  next();
  return;
};

// For unprotected routes that require the client to NOT have a valid session
export const rejectIfSession = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.session.username) {
    res.status(403).json({
      error: "Cannot access this endpoint with an ongoing session",
    });
    return;
  }
  next();
};

// Logs all incoming requests
export const logRequests = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  if (!process.env.JEST_WORKER_ID) {
    console.log(`${req.method} ${req.path}`);
  }
  next();
};

// Catches JSON parse error in the event of a malformed body
export const handleParseError = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (error.type === "entity.parse.failed") {
    res.status(400).json({ error: "Invalid JSON" })
    return;
  }
  next();
}