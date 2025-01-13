const API_URL = "http://localhost:3000";

// const PROTECTED_ENDPOINTS = [
//   "chats/get-chats-by-user",
//   "users/get-users-by-chat",
//   "users/get-recipients-by-message",
//   "messages/get-messages-by-user",
//   "messages/get-messages-by-chat",
// ];

export const apiGetRequest = async (
  endpoint: string,
  queryParameters?: Record<string, string>
): Promise<Response> => {
  const url = new URL(`${API_URL}${endpoint}`);

  // Append query parameters to url if provided
  if (queryParameters) {
    Object.entries(queryParameters).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
  }

  const options: RequestInit = { method: "GET", credentials: "include" };
  return await fetch(url, options);
};

export const apiPostRequest = async (
  endpoint: string,
  body?: Record<string, string>
): Promise<Response> => {
  const url = new URL(`${API_URL}${endpoint}`);
  const options: any = { method: "POST", credentials: "include", headers: {} };

  // Include body if provided
  if (body) {
    options.headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(body);
  }

  return await fetch(url, options as RequestInit);
};
