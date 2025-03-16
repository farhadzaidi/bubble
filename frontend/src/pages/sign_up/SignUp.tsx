import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useInvalidSession } from "../../utils/hooks";
import { validateUsername, validatePassword } from "./validation";
import { makeApiCall } from "../../utils/api";
import { generateEncryptionKeys } from "../../utils/crypto";

import Logo from "../../components/Logo";
import Loading from "../../components/Loading";
import "../../styles/form.css";

const SignUp = () => {
  const navigate = useNavigate();
  const isValidSession = useInvalidSession();

  const [loading, setLoading] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const handleUsernameChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    e.preventDefault();
    setUsername(e.target.value);
    setUsernameError(validateUsername(e.target.value));
  };

  const handlePasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    e.preventDefault();
    setPassword(e.target.value);
    setPasswordError(validatePassword(e.target.value));
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    e.preventDefault();
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    setLoading(true);

    // Delay execution to allow loading spinner to render
    // The form element needs to be stored in memory before the timeout
    const formElement = e.currentTarget;
    setTimeout(async () => {
      // Validate fields and set errors accordingly
      const formData = new FormData(formElement);
      let hasEmptyFields = false;

      const formUsername = formData.get("username") as string;
      if (formUsername === "") {
        setUsernameError("Username cannot be empty.");
        hasEmptyFields = true;
      }

      const formPassword = formData.get("password") as string;
      if (formPassword === "") {
        setPasswordError("Password cannot be empty.");
        hasEmptyFields = true;
      }

      const formConfirmPassword = formData.get("confirmPassword") as string;
      if (formConfirmPassword === "") {
        setConfirmPasswordError("Please confirm the password.");
        hasEmptyFields = true;
      }

      const isValidFormData =
        !hasEmptyFields &&
        usernameError === "" &&
        passwordError === "" &&
        confirmPasswordError === "";

      // Only send request to API if the fields are valid
      if (isValidFormData) {
        const encryptionKeys = generateEncryptionKeys(password);

        // Hit sign up and submit credentials to the server
        // The server will store the salt and auth public key in the database,
        // alongside the username
        const response = await makeApiCall(false, "POST", "/auth/sign-up", {
          body: {
            username: formUsername,
            salt: encryptionKeys.salt,
            publicKey: encryptionKeys.authPublicKey,
          },
        });

        const json = await response.json();
        if (response.ok) {
          await makeApiCall(true, "POST", "/submit-public-key", {
            body: {
              username: formUsername,
              publicKey: encryptionKeys.messagingPublicKey,
            },
          });

          const privateKey = encryptionKeys.messagingPrivateKey;
          sessionStorage.setItem("privateKey", privateKey);
          sessionStorage.setItem("username", formUsername);
          sessionStorage.setItem("token", json.token);
          navigate("/");
        } else setUsernameError("Username already exists."); // Only possible error
      }

      setLoading(false);
    }, 0);
  };

  // Ensure passwords match when either one changes
  useEffect(() => {
    setConfirmPasswordError(
      confirmPassword.length > 0 && password !== confirmPassword
        ? "Passwords do not match"
        : ""
    );
  }, [password, confirmPassword]);

  return isValidSession ? null : (
    <div className="container">
      <Logo />
      <h2 className="text-center">Sign Up</h2>
      <hr />
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <label htmlFor="username">
            <small>Username</small>
          </label>
          <input
            style={usernameError !== "" ? { outline: "2px solid #c34343" } : {}}
            type="text"
            name="username"
            placeholder="Username"
            value={username}
            onChange={handleUsernameChange}
          />
          {usernameError !== "" && (
            <small className="danger">{usernameError}</small>
          )}

          <label htmlFor="password">
            <small>Password</small>
          </label>
          <input
            style={passwordError !== "" ? { outline: "2px solid #c34343" } : {}}
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
          />
          {passwordError !== "" && (
            <small className="danger">{passwordError}</small>
          )}

          <label htmlFor="confirmPassword">
            <small>Confirm Password</small>
          </label>
          <input
            style={
              confirmPasswordError !== ""
                ? { outline: "2px solid #c34343" }
                : {}
            }
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            aria-invalid={confirmPasswordError != "" ? true : undefined}
          />
          {confirmPasswordError !== "" && (
            <small className="danger">{confirmPasswordError}</small>
          )}

          {loading ? (
            <div className="text-center">
              <Loading />
            </div>
          ) : (
            <button type="submit">Submit</button>
          )}

          <small className="text-center">
            Already have an account? <a href="/sign-in">Sign in</a>
          </small>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
