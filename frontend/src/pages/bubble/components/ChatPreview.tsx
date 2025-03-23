type Props = {
  chatId: string;
  chatName: string;
  numNewMessages: number;
  setChatId: React.Dispatch<React.SetStateAction<string>>;
};

function ChatPreview({ chatId, chatName, numNewMessages, setChatId }: Props) {
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setChatId(chatId);
  };

  return (
    <div className="chat-preview" onClick={handleClick}>
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
