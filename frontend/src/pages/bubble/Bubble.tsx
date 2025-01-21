import { useValidSession } from "../../utils/hooks";

import SignOutButton from "./components/SignOutButton";
import ChatPreviewList from "./components/ChatPreviewList";
import ChatArea from "./components/ChatArea";

import "./bubble.css";

function Bubble() {
  const [username, isValidSession] = useValidSession();

  return !isValidSession ? null : (
    // TODO: ChatInvite.tsx
    <div className="container">
      <SignOutButton />
      <div className="app">
        <ChatPreviewList />
        <ChatArea />
      </div>
    </div>
  );
}

export default Bubble;
