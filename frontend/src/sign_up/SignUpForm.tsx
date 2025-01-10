import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { validateUsername, validatePassword } from "./validation";
import { apiPostRequest } from "../utils/api";
import { hashPassword } from "../utils/crypto";

const SignUpForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const navigate = useNavigate();

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

  const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>): void => {
    e.preventDefault();
    setUsername(e.target.value);
    setUsernameError(validateUsername(e.target.value));
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>): void => {
    e.preventDefault();
    setPassword(e.target.value);
    setPasswordError(validatePassword(e.target.value));
  };

  const handleConfirmPasswordChange = (
    e: ChangeEvent<HTMLInputElement>
  ): void => {
    e.preventDefault();
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const isValidFormData = validateFormData(formData);
    if (isValidFormData) {
      // Password will be hashed server-side as well
      const hashedPassword = await hashPassword(password);
      const response = await apiPostRequest("/auth/sign-up", {
        username: username,
        password: hashedPassword,
      });

      if (response.ok) {
        // TODO
        console.log("Sign up successful");
      } else setUsernameError("Username already exists"); // Only possible error
    }
  };

  // Ensure passwords match when either one changes
  useEffect(() => {
    setConfirmPasswordError(
      password !== confirmPassword ? "Passwords do not match" : ""
    );
  }, [password, confirmPassword]);

  return (
    <>
      <h3 className="primary-color text-center">Sign Up</h3>
      <article>
        <form onSubmit={handleSubmit}>
          <fieldset>
            <label>
              Username
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={username}
                onChange={handleUsernameChange}
                aria-invalid={usernameError !== "" ? true : undefined}
              />
              {usernameError !== "" && <small>{usernameError}</small>}
            </label>

            <label>
              Password
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={password}
                onChange={handlePasswordChange}
                aria-invalid={passwordError !== "" ? true : undefined}
              />
              {passwordError !== "" && <small>{passwordError}</small>}
            </label>

            <label>
              Confirm Password
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                aria-invalid={confirmPasswordError != "" ? true : undefined}
              />
              {confirmPasswordError !== "" && (
                <small>{confirmPasswordError}</small>
              )}
            </label>

            <input type="submit" />
          </fieldset>
        </form>

        <small>
          Already have an account? <a href="/sign-in">Sign in</a>
        </small>
      </article>
    </>
  );
};

export default SignUpForm;
