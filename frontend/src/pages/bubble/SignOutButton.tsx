import { useNavigate } from "react-router-dom";
import { apiPostRequest } from "../../utils/api";

const styles = {
  container: {
    display: "flex",
    justifyContent: "flex-end",
  },
};

function SignOutButton() {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await apiPostRequest("/auth/sign-out");
    sessionStorage.clear();
    navigate("/sign-in");
  };

  return (
    <div style={styles.container}>
      <button onClick={handleSignOut}>Sign Out</button>
    </div>
  );
}

export default SignOutButton;
