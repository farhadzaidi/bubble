import { useState, useEffect, useRef } from "react";
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

  // Used for scrolling to the bottom when new messages appear
  const scrollRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sortMessages = (messages: ForwardedMessage[]) => {
    messages.sort(
      (a, b) => new Date(a.sent_at).getTime() - new Date(b.sent_at).getTime()
    );
  };


  // Checks if two timestamps are within a certain time window
  const isRecent = (timestamp1: string, timestamp2: string): boolean => {
    const date1 = new Date(timestamp1);
    const date2 = new Date(timestamp2);

    const WINDOW = 1000 * 60 * 5; // 5 minute
    const difference = Math.abs(date1.getTime() - date2.getTime());
    return difference < WINDOW;
  };

  // Formats timestamp to HH:MM in local time
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    let hours = date.getHours();
    const ampm = hours >= 12 ? "PM" : "AM";

    // Change from 24-hour to AM/PM
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 should be 12

    const formattedHours = String(hours).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${formattedHours}:${minutes} ${ampm}`;
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

      console.log(message.sent_at);
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
  let prevTimestamp: string | null = null;

  return (
    // TODO: add loading animation if messages haven't been loaded in yet
    <div className="chat-log">
      {messages.length === 0 && (
        <span className="no-messages">No Messages</span>
      )}

      {/* TODO: order by timestamp */}
      {messages.map(({ content, message_id, sender, sent_at }) => {
        const isSent = sender === sessionStorage.getItem("username");

        const sameSender = prevSender === sender;
        const sameTimestamp = prevTimestamp
          ? isRecent(prevTimestamp, sent_at)
          : false;

        prevSender = sender;
        prevTimestamp = sent_at;

        if (sender === "") sender = "You";

        return (
          <div
            key={message_id}
            className={`message ${isSent ? "sent" : "received"}-message`}
          >
            <div className="message-metadata">
              {!sameSender && <span className="message-sender">{sender}</span>}
              {!sameTimestamp && (
                <span className="message-time">{formatTimestamp(sent_at)}</span>
              )}
            </div>
            <span className={`content ${isSent ? "sent" : "received"}-content`}>
              {content}
            </span>
          </div>
        );
      })}

      <div ref={scrollRef} />
    </div>
  );
}

export default ChatLog;
