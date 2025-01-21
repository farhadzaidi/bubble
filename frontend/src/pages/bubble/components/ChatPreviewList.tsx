import ChatPreview from "./ChatPreview";

type ChatPreviews = {
  chatId: string;
  chatName: string;
  numNewMessages: number;
}[];
const chatPreviews: ChatPreviews = [
  { chatId: "12sdafas3", chatName: "test1", numNewMessages: 10 },
  { chatId: "45sadfadsf6", chatName: "test2", numNewMessages: 0 },
  { chatId: "78fasdfsadfds9", chatName: "test3", numNewMessages: 5 },
  { chatId: "7fdsasfdaa89", chatName: "test3", numNewMessages: 5 },
  { chatId: "73fsadfasd89", chatName: "test3", numNewMessages: 5 },
  { chatId: "7fdasdfsdafsa89", chatName: "test3", numNewMessages: 5 },
  { chatId: "7fdafasdfs89", chatName: "test3", numNewMessages: 5 },
  { chatId: "7fsddasffasa89", chatName: "test3", numNewMessages: 5 },
  { chatId: "7fafsadfasdds89", chatName: "test3", numNewMessages: 5 },
  { chatId: "78ffadsfasdsad9", chatName: "test3", numNewMessages: 5 },
  { chatId: "7fadfasasdfds89", chatName: "test3", numNewMessages: 5 },
  { chatId: "7fsfdasasasda89", chatName: "test3", numNewMessages: 5 },
  { chatId: "7fdsfdfasdfasa89", chatName: "test3", numNewMessages: 5 },
  { chatId: "7ffadsfasdasd89", chatName: "test3", numNewMessages: 5 },
  { chatId: "78fsfdsafasdda9", chatName: "test3", numNewMessages: 5 },
  { chatId: "7fsfasdfda89", chatName: "test3", numNewMessages: 5 },
  { chatId: "7fddsafadssa89", chatName: "test3", numNewMessages: 5 },
  { chatId: "78fafasdfsd9", chatName: "test3", numNewMessages: 5 },
  { chatId: "789fdfsadfasd", chatName: "test3", numNewMessages: 5 },
  { chatId: "78fdafsdfassa9", chatName: "test3", numNewMessages: 5 },
  { chatId: "78faasdfsafdsasd9", chatName: "test3", numNewMessages: 5 },
];

function ChatPreviewList() {
  return (
    <div className="chat-preview-list">
      {chatPreviews.length === 0 && "You have no active chats"}
      {chatPreviews.map(({ chatId, chatName, numNewMessages }) => {
        return (
          <ChatPreview
            key={chatId}
            chatName={chatName}
            numNewMessages={numNewMessages}
          />
        );
      })}
    </div>
  );
}

export default ChatPreviewList;
