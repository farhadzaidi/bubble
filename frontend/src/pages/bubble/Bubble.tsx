import { useState } from "react";
import { useValidSession } from "../../utils/hooks";
import { createSocketConnection } from "./socket";

import Menu from "./components/Menu";
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
      <div className="container">
        <Menu />
        <div className="app">
          <ChatPreviewList setChatId={setChatId} />
          <ChatArea chatId={chatId} socket={socket} />
        </div>
      </div>
    );
}

export default Bubble;
