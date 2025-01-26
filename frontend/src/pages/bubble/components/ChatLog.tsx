import { useState, useEffect } from "react";
import { makeApiCall } from "../../../utils/api";
import { Socket } from "socket.io-client";

type Message = {
  content: string;
  message_id: string;
  sender: string;
  sent_at: string;
};

type Props = {
  chatId: string;
  socket: Socket;
};

function ChatLog({ chatId, socket }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);

  // Get messages by chat
  useEffect(() => {
    (async () => {
      let response = await makeApiCall(
        "GET",
        "/messages/get-messages-by-chat",
        { queryParameters: { chatId } }
      );
      const json = await response.json();
      setMessages(json);
    })();
  }, [chatId]);

  // socket.on("message", (message) => {
  //   setMessages([...messages, message]);
  // });

  let prevSender: string | null = null;

  return (
    // TODO: add loading animation messages haven't been loaded in yet
    <div className="chat-log">
      {messages.length === 0 && (
        <span className="no-messages">No Messages</span>
      )}
      {messages.map(({ content, message_id, sender, sent_at }) => {
        const isSent = sender === sessionStorage.getItem("username");
        const sameSender = prevSender === sender;
        prevSender = sender;

        if (sender === "") sender = "You";

        return (
          <div
            key={message_id}
            className={`message ${isSent ? "sent" : "received"}-message`}
          >
            {!sameSender && <span className="message-info">{sender}</span>}
            <span className={`content ${isSent ? "sent" : "received"}-content`}>
              {content}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default ChatLog;
