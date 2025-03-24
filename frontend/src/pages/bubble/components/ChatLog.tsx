import { useState, useEffect } from "react";
import { makeApiCall } from "../../../utils/api";
import { Socket } from "socket.io-client";
import { decryptMessageWithSymmetricKey } from "../../../utils/crypto";

type ForwardedMessage = {
  message_id: string;
  sender: string;
  nonce: string;
  content: string;
  sent_at: string;
};

type Props = {
  chatId: string;
  socket: Socket;
};

function ChatLog({ chatId, socket }: Props) {
  const [messages, setMessages] = useState<ForwardedMessage[]>([]);

  const sortMessages = (messages: ForwardedMessage[]) => {
    messages.sort(
      (a, b) => new Date(a.sent_at).getTime() - new Date(b.sent_at).getTime()
    );
  };

  // Get messages by chat
  useEffect(() => {
    (async () => {
      let response = await makeApiCall(
        false,
        "GET",
        "/messages/get-messages-by-chat",
        { queryParameters: { chatId } }
      );
      const json: ForwardedMessage[] = await response.json();

      let decryptedMessages: ForwardedMessage[] = [];
      for (const message of json) {
        const decryptedMessage = decryptMessageWithSymmetricKey(
          message.content,
          message.nonce,
          sessionStorage.getItem(`symmetricKey:${chatId}`) as string
        );

        message.content = decryptedMessage;
        decryptedMessages.push(message);
      }

      sortMessages(decryptedMessages);
      setMessages(decryptedMessages);
    })();
  }, [chatId]);

  // Receive live messages
  useEffect(() => {
    const handleForwardedMessage = (message: ForwardedMessage) => {
      // Decrypt message content
      const decryptedMessage = decryptMessageWithSymmetricKey(
        message.content,
        message.nonce,
        sessionStorage.getItem(`symmetricKey:${chatId}`) as string
      );

      message.content = decryptedMessage;
      setMessages((prev) => {
        const updated = [...prev, message];
        sortMessages(updated);
        return updated;
      });
    };

    socket.on("forwardedMessage", handleForwardedMessage);

    return () => {
      socket.off("forwardedMessage", handleForwardedMessage);
    };
  }, [socket]);

  let prevSender: string | null = null;

  return (
    // TODO: add loading animation messages haven't been loaded in yet
    <div className="chat-log">
      {messages.length === 0 && (
        <span className="no-messages">No Messages</span>
      )}

      {/* TODO: order by timestamp */}
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
