import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useInvalidSession } from "../../utils/hooks";
import { validateUsername, validatePassword } from "./validation";
import { makeApiCall } from "../../utils/api";
import { generateAuthPublicKey } from "../../utils/crypto";

import Logo from "../../components/Logo";
import "../../styles/form.css";

const SignUp = () => {
  const navigate = useNavigate();
  const isValidSession = useInvalidSession();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  // Helper function to ensure form data is not empty on submit and set error
  // message(s) accordingly
  const validateFormData = (formData: FormData) => {
    let isValidFormData = true;

    const username = formData.get("username") as string;
    if (username === "") {
      setUsernameError("Username cannot be empty.");
      isValidFormData = false;
    }

    const password = formData.get("password") as string;
    if (password === "") {
      setPasswordError("Password cannot be empty.");
      isValidFormData = false;
    }

    const confirmPassword = formData.get("confirmPassword") as string;
    if (confirmPassword === "") {
      setConfirmPasswordError("Please confirm the password.");
      isValidFormData = false;
    }

    return isValidFormData;
  };

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

  // const handleSubmit = async (
  //   e: React.FormEvent<HTMLFormElement>
  // ): Promise<void> => {
  //   e.preventDefault();
  //   const formData = new FormData(e.currentTarget);
  //   const isValidFormData = validateFormData(formData);
  //   if (isValidFormData) {
  //     // Password will be hashed server-side as well
  //     const hashedPassword = await hashPassword(password);
  //     const response = await makeApiCall("POST", "/auth/sign-up", {
  //       body: {
  //         username: username,
  //         password: hashedPassword,
  //       },
  //     });

  //     const json = await response.json();
  //     if (response.ok) {
  //       sessionStorage.setItem("username", username);
  //       sessionStorage.setItem("token", json.token);
  //       navigate("/");
  //     } else setUsernameError("Username already exists"); // Only possible error
  //   }
  // };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const isValidFormData = validateFormData(formData);
    if (isValidFormData) {
      // TODO: Loading...
      const { salt, publicKey } = generateAuthPublicKey(password);
      const response = await makeApiCall("POST", "/auth/sign-up", {
        body: { username, salt, publicKey },
      });

      const json = await response.json();
      if (response.ok) {
        sessionStorage.setItem("username", username);
        sessionStorage.setItem("token", json.token);
        navigate("/");
      } else setUsernameError("Username already exists"); // Only possible error
    }
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

          <button type="submit">Submit</button>
          <small className="text-center">
            Already have an account? <a href="/sign-in">Sign in</a>
          </small>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
