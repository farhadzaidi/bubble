import { makeApiCall } from "./api";

// Returns the username if the session is valid, otherwise an empty string
export const checkSession = async (): Promise<string> => {
  const response = await makeApiCall(false, "POST", "/auth/check-session");
  const json = await response.json();
  if ("username" in json) return json.username;
  else return "";
};
