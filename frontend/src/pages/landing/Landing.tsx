import { useNavigate } from "react-router-dom";
import { useInvalidSession } from "../../utils/hooks";
import "./landing.css";

const Landing = () => {
  const isValidSession = useInvalidSession();
  const navigate = useNavigate();

  const handleSignUp = () => {
    navigate("/sign-up");
  };

  const handleSignIn = () => {
    navigate("/sign-in");
  };

  return isValidSession ? null : (
    <div className="container">
      <section className="text-center">
        <h1 className="clear-margin">
          Welcome to <span className="primary">Bubble</span>
        </h1>
        <small>Private. Secure. Simple.</small>
      </section>
      <section className="text-center">
        <p>
          Bubble is a free and open-source messenger designed with security in
          mind.
        </p>
        <p>
          All messages are{" "}
          <span className="primary">end-to-end encrypted </span>
          and <span className="primary">disappear after 24 hours</span> to
          ensure your privacy.
        </p>
        <p>
          Create an account with just a username and password—no email, phone
          number, or personal info needed.
        </p>
        <div className="button-container">
          <button className="outline-button" onClick={handleSignUp}>
            Sign Up
          </button>
          <button className="button" onClick={handleSignIn}>
            Sign In
          </button>
        </div>
      </section>
    </div>
  );
};

export default Landing;
