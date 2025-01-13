import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { checkSession } from "./session";

// Checks session validity and redirects to sign in page for invalid sessions
// Also, sets and returns username and isValidSession
export const useValidSession = (): [
  username: string,
  isValidSession: boolean
] => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [isValidSession, setIsValidSession] = useState(false);

  useEffect(() => {
    // Async wrapper
    (async () => {
      const username = await checkSession();
      if (username === "") navigate("/sign-in"); // Session is invalid
      else {
        setUsername(username);
        setIsValidSession(true);
      }
    })();
  }, [navigate]);

  return [username, isValidSession];
};

// Checks session validity and redirects to home page for valid sessions
// Also, sets and returns isValidSession
export const useInvalidSession = (): boolean => {
  const navigate = useNavigate();

  const [isValidSession, setIsValidSession] = useState(true);

  useEffect(() => {
    // Async wrapper
    (async () => {
      const username = await checkSession();
      if (username !== "") navigate("/"); // Session is valid
      else setIsValidSession(false);
    })();
  }, [navigate]);

  return isValidSession;
};
