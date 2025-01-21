const messages: {
  messageId: string;
  sender: string;
  content: string;
  timestamp: string;
}[] = [
  {
    messageId: "fjhaljsdhflasd",
    sender: "Friend",
    content: "Hello!",
    timestamp: "2:57 pm",
  },
  {
    messageId: "fjhadljsdhflasd",
    sender: "",
    content: "Hi there",
    timestamp: "2:58 pm",
  },
  {
    messageId: "fjhaljsdhdflasd",
    sender: "Friend",
    content:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum praesentium alias fugit ullam quisquam, id doloribus. Nobis quasi ad dolore numquam fugit, deserunt eius minus sed laborum doloremque alias quaerat.",
    timestamp: "2:58 pm",
  },
  {
    messageId: "fjhaljsdashflasd",
    sender: "Friend",
    content:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum praesentium alias fugit ullam quisquam, id doloribus. Nobis quasi ad dolore numquam fugit, deserunt eius minus sed laborum doloremque alias quaerat.",
    timestamp: "2:58 pm",
  },

  {
    messageId: "fjhaljsdsfadhflasd",
    sender: "",
    content:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum praesentium alias fugit ullam quisquam, id doloribus. Nobis quasi ad dolore numquam fugit, deserunt eius minus sed laborum doloremque alias quaerat.",
    timestamp: "2:59 pm",
  },
  {
    messageId: "fjhalsadfjsdhflasd",
    sender: "",
    content:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum praesentium alias fugit ullam quisquam, id doloribus. Nobis quasi ad dolore numquam fugit, deserunt eius minus sed laborum doloremque alias quaerat.",
    timestamp: "2:59 pm",
  },
];

function ChatLog() {
  let prevSender: string | null = null;

  return (
    <div className="chat-log">
      {messages.length === 0 && (
        <span className="no-messages">No Messages</span>
      )}
      {messages.map(({ messageId, sender, content, timestamp }) => {
        const isSent = sender === "";
        const sameSender = prevSender === sender;

        prevSender = sender;

        return (
          <div
            key={messageId}
            className={`message ${isSent ? "sent" : "received"}-message`}
          >
            {!isSent && !sameSender && (
              <span className="message-info">{sender}</span>
            )}
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
