import { useState } from "react";
import { useValidSession } from "../../utils/hooks";
import { createSocketConnection } from "./socket";

import SignOutButton from "./components/SignOutButton";
import ChatPreviewList from "./components/ChatPreviewList";
import ChatArea from "./components/ChatArea";

import "./bubble.css";

function Bubble() {
  const socket = createSocketConnection();

  const [username, isValidSession] = useValidSession();
  sessionStorage.setItem("username", username);

  const [chatId, setChatId] = useState("");

  if (isValidSession)
    return !isValidSession ? null : (
      // TODO: ChatInvite.tsx
      <div className="container">
        <SignOutButton />
        <div className="app">
          <ChatPreviewList setChatId={setChatId} />
          <ChatArea chatId={chatId} socket={socket} />
        </div>
      </div>
    );
}

export default Bubble;
