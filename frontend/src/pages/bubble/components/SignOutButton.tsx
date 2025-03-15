import { useNavigate } from "react-router-dom";
import { makeApiCall } from "../../../utils/api";

function SignOutButton() {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await makeApiCall(false, "POST", "/auth/sign-out");
    sessionStorage.clear();
    navigate("/");
  };

  return <button className="button" onClick={handleSignOut}>
    Sign Out
  </button>
}

export default SignOutButton;
