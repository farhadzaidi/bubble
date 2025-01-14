import { useInvalidSession } from "../../utils/hooks";

import Welcome from "./Welcome";
import SignUpForm from "./SignUpForm";

const SignUp = () => {
  const isValidSession = useInvalidSession();

  return isValidSession ? null : (
    <>
      <Welcome />
      <SignUpForm />
    </>
  );
};

export default SignUp;
