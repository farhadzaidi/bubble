import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { makeApiCall } from "../../utils/api";
import { useInvalidSession } from "../../utils/hooks";
import Logo from "../../components/Logo";
import "../../styles/form.css";
import "./animation.css";
import { signChallenge } from "../../utils/crypto";

function SignIn() {
  const navigate = useNavigate();
  const isValidSession = useInvalidSession();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [errorKey, setErrorKey] = useState(0); // Used to reanimate authError

  const handleUsernameChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    e.preventDefault();
    setUsername(e.target.value);
  };

  const handlePasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    e.preventDefault();
    setPassword(e.target.value);
  };

  // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   const hashedPassword = await hashPassword(password);
  //   const response = await makeApiCall("POST", "/auth/sign-in", {
  //     body: {
  //       username: username,
  //       password: hashedPassword,
  //     },
  //   });

  //   const json = await response.json();
  //   if (response.ok) {
  //     sessionStorage.setItem("token", json.token);
  //     navigate("/");
  //   } else {
  //     setAuthError(json.error);
  //     setErrorKey((value) => value + 1);
  //   }
  // };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let isValid = false;
    let response = await makeApiCall("POST", "/auth/request-challenge", {
      body: { username },
    });

    let json = await response.json();
    if (response.ok) {
      // Sign challenge using private key and send back to the server
      const signature = signChallenge(json.challenge, password, json.salt);
      console.log(`Created signature: ${signature}`);
      response = await makeApiCall("POST", "/auth/verify-challenge", {
        body: { username, signature },
      });

      json = await response.json();
      if (response.ok) {
        isValid = true;
        sessionStorage.setItem("token", json.token);
        navigate("/");
      }
    }

    if (!isValid) {
      setAuthError(json.error);
      setErrorKey((value) => value + 1);
    }
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

          <button type="submit">Submit</button>
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
