import crypto from "crypto";
import jwt from "jsonwebtoken";

const AUTH_TOKEN_TTL = "1m";

// Generates a JWT auth token
export const generateAuthToken = (username: string) => {
  const secret = process.env.JWT_SECRET || "jwt_secret";
  return jwt.sign({ username }, secret, {
    expiresIn: AUTH_TOKEN_TTL,
  });
};

export const createChallenge = (): string => {
  return crypto.randomBytes(32).toString("hex");
};

// Converts Ed25519 hex-encoded public key to a crypto.KeyObject so that it can
// be used for verifying signaturess
const createPublicKey = (publicKey: string): crypto.KeyObject => {
  const publicKeyBytes = Buffer.from(publicKey, "hex");
  const spkiHeader = Buffer.from("302a300506032b6570032100", "hex");
  return crypto.createPublicKey({
    key: Buffer.concat([spkiHeader, publicKeyBytes]),
    format: "der",
    type: "spki",
  });
};

export const verifyChallenge = (
  challenge: string,
  signature: string,
  publicKey: string
): boolean => {
  const challengeBytes = Buffer.from(challenge, "hex");
  const signatureBytes = Buffer.from(signature, "hex");
  const publicKeyObject = createPublicKey(publicKey);
  return crypto.verify(null, challengeBytes, publicKeyObject, signatureBytes);
};
