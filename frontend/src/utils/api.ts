import { assert } from "chai";
import { SERVER_URL, LEDGER_URL } from "../constants";

// This function serves as a wrapper over sendRequest in order to handle
// the use of auth tokens
export const makeApiCall = async (
  targetLedger: boolean,
  method: string,
  endpoint: string,
  args?: {
    queryParameters?: Record<string, string>;
    body?: Record<string, string>;
  }
): Promise<Response> => {
  const response = await sendRequest(targetLedger, method, endpoint, args);
  if (response.status === 401) {
    const json = await response.clone().json();
    if (json.error === "Invalid or expired auth token") {
      sessionStorage.setItem("token", await fetchAuthToken());
      return await sendRequest(targetLedger, method, endpoint, args);
    }
  }
  return response;
};

const fetchAuthToken = async (): Promise<string> => {
  const response = await sendRequest(false, "POST", "/auth/get-token");
  const json = await response.json();
  return json.token;
};

const sendRequest = async (
  targetLedger: boolean,
  method: string,
  endpoint: string,
  args?: {
    queryParameters?: Record<string, string>;
    body?: Record<string, string>;
  }
): Promise<Response> => {
  // Validate request
  method = method.toUpperCase();
  assert(method === "GET" || method === "POST", `Invalid method '${method}'`);
  if (method === "GET") assert(!args?.body, "GET request cannot have a body.");
  if (method === "POST")
    assert(!args?.queryParameters, "POST request cannot have query paramters.");

  const url = new URL(`${targetLedger ? LEDGER_URL : SERVER_URL}${endpoint}`);
  const options: any = { method: method, credentials: "include", headers: {} };

  // Set auth token
  options.headers["Authorization"] = `Bearer ${sessionStorage.getItem(
    "token"
  )}`;

  // Append query parameters to url if provided
  if (args?.queryParameters) {
    Object.entries(args.queryParameters).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
  }

  // Include body if provided
  if (args?.body) {
    options.headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(args.body);
  }

  return await fetch(url, options as RequestInit);
};
