import { useState } from "react";
import { Socket } from "socket.io-client";

type Props = {
  chatId: string;
  socket: Socket;
};

function SendMessage({ chatId, socket }: Props) {
  const [messageContent, setMessageContent] = useState("");

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    setMessageContent(e.target.value);
  };

  const sendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    socket.emit("message", `${chatId} ${messageContent}`);
    setMessageContent("");
  };

  return (
    <form className="send-message" onSubmit={sendMessage}>
      <textarea
        placeholder="Message..."
        value={messageContent}
        onChange={handleMessageChange}
      ></textarea>
      <button type="submit">Send</button>
    </form>
  );
}

export default SendMessage;
