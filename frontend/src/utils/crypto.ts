// This function hashes a password before submitting it to the sign-in/sign-up
// endpoints. While this doesn't necessarily improve the security of the system,
// (since anyone who sees the hash in plaintext can just use it as the password)
// it will help improve security for users who use the same passwords across
// multiple applications.
export const hashPassword = async (password: string): Promise<string> => {
  const salt = "5dd613e02cd9700d65920d421e0ba252'";
  const data = new TextEncoder().encode(password + salt);
  const hash = await crypto.subtle.digest("SHA-256", data);

  return Array.from(new Uint8Array(hash))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
};
