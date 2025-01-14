import { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { apiPostRequest } from "../../utils/api";
import { hashPassword } from "../../utils/crypto";
import { useInvalidSession } from "../../utils/hooks";

function SignIn() {
  const navigate = useNavigate();
  const isValidSession = useInvalidSession();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>): void => {
    e.preventDefault();
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>): void => {
    e.preventDefault();
    setPassword(e.target.value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const hashedPassword = await hashPassword(password);
    const response = await apiPostRequest("/auth/sign-in", {
      username: username,
      password: hashedPassword,
    });

    const json = await response.json();
    if (response.ok) {
      sessionStorage.setItem("token", json.token);
      navigate("/");
    } else setAuthError(json.error);
  };

  return isValidSession ? null : (
    <>
      <h3 className="primary-color text-center">Sign In</h3>
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
              />
            </label>

            <label>
              Password
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={password}
                onChange={handlePasswordChange}
              />
            </label>
            <input type="submit" />
          </fieldset>
        </form>

        <small>
          Don't have an account? <a href="/sign-up">Sign Up</a>
        </small>

        {authError !== "" && <h6 className="text-danger">{authError}</h6>}
      </article>
    </>
  );
}

export default SignIn;
