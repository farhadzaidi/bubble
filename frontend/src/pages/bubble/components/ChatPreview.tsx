type ChatProp = {
  chatName: string;
  numNewMessages: number;
};

function ChatPreview({ chatName, numNewMessages }: ChatProp) {
  return (
    <div className="chat-preview">
      <h5 className="primary">{chatName}</h5>
      <small>
        {numNewMessages === 0
          ? "No new messages"
          : `${numNewMessages} new messages`}
      </small>
    </div>
  );
}
export default ChatPreview;
