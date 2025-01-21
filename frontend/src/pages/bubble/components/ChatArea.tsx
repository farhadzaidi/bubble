import ChatLog from "./ChatLog";
import SendMessage from "./SendMessage";

function ChatArea() {
  return (
    <div className="chat-area">
      <ChatLog />
      <SendMessage />
    </div>
  );
}

export default ChatArea;
