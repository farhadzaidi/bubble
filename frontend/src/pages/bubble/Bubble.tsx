import { useValidSession } from "../../utils/hooks";

import SignOutButton from "./SignOutButton";

function Bubble() {
  const [username, isValidSession] = useValidSession();

  return !isValidSession ? null : (
    <>
      <SignOutButton />
      <h1>Hello {username}</h1>
    </>
  );
}

export default Bubble;
