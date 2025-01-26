import { Socket } from "socket.io-client";
import ChatLog from "./ChatLog";
import SendMessage from "./SendMessage";

type Props = {
  chatId: string;
  socket: Socket;
};

function ChatArea({ chatId, socket }: Props) {
  return (
    <div className="chat-area">
      {!chatId ? (
        <div style={{ margin: "auto" }}>
          Select a chat to view and send messages
        </div>
      ) : (
        <>
          <ChatLog chatId={chatId} socket={socket} />
          <SendMessage chatId={chatId} socket={socket} />
        </>
      )}
    </div>
  );
}

export default ChatArea;
