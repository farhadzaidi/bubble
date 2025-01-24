import { useNavigate } from "react-router-dom";
import { makeApiCall } from "../../../utils/api";

function SignOutButton() {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await makeApiCall("POST", "/auth/sign-out");
    sessionStorage.clear();
    navigate("/");
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "right",
        paddingInline: "20px",
        paddingBottom: "20px",
      }}
    >
      <button className="button" onClick={handleSignOut}>
        Sign Out
      </button>
    </div>
  );
}

export default SignOutButton;
