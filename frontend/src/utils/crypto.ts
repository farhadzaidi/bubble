import sodium from "libsodium-wrappers-sumo";

await sodium.ready;

// Use Argon2 to derive a key from the provided password and salt
const generateSeed = (password: string, salt: Uint8Array): Uint8Array => {
  return sodium.crypto_pwhash(
    32, // size (in bytes) of seed
    password,
    salt,
    sodium.crypto_pwhash_OPSLIMIT_MODERATE,
    sodium.crypto_pwhash_MEMLIMIT_MODERATE,
    sodium.crypto_pwhash_ALG_ARGON2ID13
  );
};

// Use Ed25519 and X25519 to generate authentication and messaging public keys, respectively.
export const generatePublicKeys = (
  password: string
): { salt: string; authPublicKey: string; messagingPublicKey: string } => {
  // Generate seed with password and salt using KDF
  const salt = sodium.randombytes_buf(sodium.crypto_pwhash_SALTBYTES);
  const seed = generateSeed(password, salt);

  // Generate key pairs
  const authKeyPair = sodium.crypto_sign_seed_keypair(seed);
  const messagingKeyPair = sodium.crypto_box_seed_keypair(seed);

  // Only need to return salt and public keys on sign up
  return {
    salt: sodium.to_hex(salt),
    authPublicKey: sodium.to_hex(authKeyPair.publicKey),
    messagingPublicKey: sodium.to_hex(messagingKeyPair.publicKey),
  };
};

// Sign challenge using private key generated from password + salt
export const signChallenge = (
  challenge: string,
  password: string,
  salt: string
) => {
  const seed = generateSeed(password, sodium.from_hex(salt));
  const keyPair = sodium.crypto_sign_seed_keypair(seed);
  const signature = sodium.crypto_sign_detached(
    sodium.from_hex(challenge),
    keyPair.privateKey
  );
  return sodium.to_hex(signature);
};
