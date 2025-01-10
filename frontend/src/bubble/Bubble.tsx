import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Bubble() {
  const navigate = useNavigate();

  const isValidSession = sessionStorage.getItem("username") !== null;
  console.log(isValidSession);

  useEffect(() => {
    if (!isValidSession) navigate("/sign-up");
  }, [isValidSession, navigate]);

  return !isValidSession ? null : (
    <>
      <h1>Hello</h1>
    </>
  );
}

export default Bubble;
