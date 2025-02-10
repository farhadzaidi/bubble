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

// Helper function to convert hex-encoded public key into a KeyObject
const ed25519HexToPem = (publicKey: string): string => {
  const publicKeyBytes = Buffer.from(publicKey, "hex");
  const asn1Prefix = Buffer.from([
    0x30,
    0x2a, // SEQUENCE
    0x30,
    0x05, // SEQUENCE (Algorithm Identifier)
    0x06,
    0x03,
    0x2b,
    0x65,
    0x70, // OID 1.3.101.112 (Ed25519)
    0x03,
    0x21,
    0x00, // BIT STRING (Public Key Data)
  ]);

  const derBuffer = Buffer.concat([asn1Prefix, publicKeyBytes]);
  const base64Encoded = derBuffer.toString("base64");
  const formattedBase64 = (base64Encoded.match(/.{1,64}/g) ?? []).join("\n");
  return `-----BEGIN PUBLIC KEY-----\n${formattedBase64}\n-----END PUBLIC KEY-----`;
};

export const verifyChallenge = (
  challenge: string,
  signature: string,
  publicKey: string
): boolean => {
  console.log(
    `Verifying...\nchallenge: ${challenge}\npublicKey: ${publicKey}\n`
  );
  const challengeBytes = Buffer.from(challenge, "hex");
  const signatureBytes = Buffer.from(signature, "hex");
  const publicKeyPem = ed25519HexToPem(publicKey);

  return crypto.verify(null, challengeBytes, publicKeyPem, signatureBytes);
};
