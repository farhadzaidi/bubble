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

// Uses Ed25519 to generate authentication public key
// Uses X25519 to generate messaging public/private key pair
export const generateEncryptionKeys = (
  password: string
): {
  salt: string;
  authPublicKey: string;
  messagingPublicKey: string;
  messagingPrivateKey: string;
} => {
  // Generate seed with password and salt using KDF
  const salt = sodium.randombytes_buf(sodium.crypto_pwhash_SALTBYTES);
  const seed = generateSeed(password, salt);

  // Generate key pairs
  const authKeyPair = sodium.crypto_sign_seed_keypair(seed);
  const messagingKeyPair = sodium.crypto_box_seed_keypair(seed);

  // We don't need to return the authentication private key on sign up
  return {
    salt: sodium.to_hex(salt),
    authPublicKey: sodium.to_hex(authKeyPair.publicKey),
    messagingPublicKey: sodium.to_hex(messagingKeyPair.publicKey),
    messagingPrivateKey: sodium.to_hex(messagingKeyPair.privateKey),
  };
};

// Regenerate messaging key after authentication using the user's password and
// the salt provided by the server
export const regenerateMessagingPrivateKey = (
  password: string,
  salt: string
): string => {
  const seed = generateSeed(password, sodium.from_hex(salt));
  const keyPair = sodium.crypto_box_seed_keypair(seed);
  return sodium.to_hex(keyPair.privateKey);
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

// Generates an AEGIS-256 symmetric encryption
export const generateSymmetricEncryptionKey = () => {
  const key = sodium.crypto_aead_aegis256_keygen();
  return sodium.to_hex(key);
};

// Encrypts the provided group symmetric encryption key with a given public key
// and uses the sender's private key for verification
// Returns the nonce and encrypted symmetric key
export const encryptWithPublicKey = (
  symmetricKey: string,
  recipientPublicKey: string,
  senderPrivateKey: string
): { nonce: string; encryptedSymmetricKey: string } => {
  const nonce = sodium.randombytes_buf(sodium.crypto_box_NONCEBYTES);
  const encryptedSymmetricKey = sodium.crypto_box_easy(
    sodium.from_hex(symmetricKey),
    nonce,
    sodium.from_hex(recipientPublicKey),
    sodium.from_hex(senderPrivateKey)
  );

  return {
    nonce: sodium.to_hex(nonce),
    encryptedSymmetricKey: sodium.to_hex(encryptedSymmetricKey),
  };
};

// Decrypts the provided encrypted symmetric key using the user's private key
// Also verifies sender with their public key
export const decryptWithPublicKey = (
  encryptedSymmetricKey: string,
  nonce: string,
  senderPublicKey: string,
  recipientPrivateKey: string
): string => {
  const symmetricKey = sodium.crypto_box_open_easy(
    sodium.from_hex(encryptedSymmetricKey),
    sodium.from_hex(nonce),
    sodium.from_hex(senderPublicKey),
    sodium.from_hex(recipientPrivateKey)
  );

  return sodium.to_hex(symmetricKey);
};

// Encrypts a string using the provided AEGIS-256 encryption key
export const encryptMessageWithSymmetricKey = (
  plaintext: string,
  symmetricKey: string
): { nonce: string; ciphertext: string } => {
  const nonce = sodium.randombytes_buf(sodium.crypto_aead_aegis256_NPUBBYTES);
  const ciphertext = sodium.crypto_aead_aegis256_encrypt(
    plaintext,
    null,
    null,
    nonce,
    sodium.from_hex(symmetricKey)
  );

  return {
    nonce: sodium.to_hex(nonce),
    ciphertext: sodium.to_hex(ciphertext),
  };
};

// Decrypts some ciphertext using the provided AEGIS-256 encryption key and nocne
export const decryptMessageWithSymmetricKey = (
  ciphertext: string,
  nonce: string,
  symmetricKey: string
): string => {
  const plaintext = sodium.crypto_aead_aegis256_decrypt(
    null,
    sodium.from_hex(ciphertext),
    null,
    sodium.from_hex(nonce),
    sodium.from_hex(symmetricKey)
  );

  return sodium.to_string(plaintext);
};
