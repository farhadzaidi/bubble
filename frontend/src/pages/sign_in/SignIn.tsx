import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useInvalidSession } from "../../utils/hooks";
import { makeApiCall } from "../../utils/api";
import {
  regenerateMessagingPrivateKey,
  signChallenge,
} from "../../utils/crypto";
import Logo from "../../components/Logo";
import Loading from "../../components/Loading";
import "../../styles/form.css";
import "./animation.css";

function SignIn() {
  const navigate = useNavigate();
  const isValidSession = useInvalidSession();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [errorKey, setErrorKey] = useState(0); // Used to reanimate authError
  const [loading, setLoading] = useState(false); // Used to animate loading spinner

  const handleUsernameChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    e.preventDefault();
    const usernameInput = e.target.value;
    if (usernameInput.length <= 16) setUsername(e.target.value);
  };

  const handlePasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    e.preventDefault();
    const passwordInput = e.target.value;
    if (passwordInput.length <= 256) setPassword(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const formUsername = formData.get("username") as string;
    const formPassword = formData.get("password") as string;

    let isValid = false;
    let response = await makeApiCall(false, "POST", "/auth/request-challenge", {
      body: { username: formUsername },
    });

    let json = await response.json();
    if (response.ok) {
      // Sign challenge using private key and send back to the server
      const salt = json.salt;
      const signature = signChallenge(json.challenge, formPassword, salt);
      response = await makeApiCall(false, "POST", "/auth/verify-challenge", {
        body: { username: formUsername, signature },
      });

      json = await response.json();
      if (response.ok) {
        isValid = true;

        const privateKey = regenerateMessagingPrivateKey(formPassword, salt);
        sessionStorage.setItem("privateKey", privateKey);

        sessionStorage.setItem("username", formUsername);
        sessionStorage.setItem("token", json.token);
        navigate("/");
      }
    }

    if (!isValid) {
      setAuthError(json.error);
      setErrorKey((value) => value + 1);
    }

    setLoading(false);
  };

  return isValidSession ? null : (
    <div className="container">
      <Logo />
      <h2 className="text-center">Sign In</h2>
      <hr />
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <label htmlFor="username">
            <small>Username</small>
          </label>

          <input
            type="text"
            name="username"
            placeholder="Username"
            value={username}
            onChange={handleUsernameChange}
          />

          <label htmlFor="password">
            <small>Password</small>
          </label>

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
          />

          {loading ? (
            <div className="text-center">
              <Loading />
            </div>
          ) : (
            <button type="submit">Submit</button>
          )}

          {authError !== "" && (
            <p key={errorKey} className="danger text-center expand">
              {authError}
            </p>
          )}

          <small className="text-center">
            Don't have an account? <a href="/sign-up">Sign Up</a>
          </small>
        </form>
      </div>
    </div>
  );
}

export default SignIn;
