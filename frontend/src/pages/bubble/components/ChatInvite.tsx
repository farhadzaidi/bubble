import { makeApiCall } from "../../../utils/api";

type Chat = {
  chat_id: string;
  chat_name: string;
  creator: string;
  joined: boolean;
};

type Props = {
  chatId: string;
  chatName: string;
  creator: string;
  setChatId: React.Dispatch<React.SetStateAction<string>>;
  setChats: React.Dispatch<React.SetStateAction<Chat[]>>;
};

function ChatInvite({ chatId, chatName, creator, setChatId, setChats }: Props) {
  const handleAccept = async () => {
    const response = await makeApiCall(
      false,
      "POST",
      "/chats/accept-chat-invite",
      {
        queryParameters: {
          username: sessionStorage.getItem("username") as string,
        },
        body: { chatId },
      }
    );

    if (response.ok) {
      setChats((chats) =>
        chats.map((chat) => {
          if (chat.chat_id == chatId) return { ...chat, joined: true };
          else return chat;
        })
      );
      setChatId(chatId);
    }
  };

  const handleDecline = async () => {
    const response = await makeApiCall(
      false,
      "POST",
      "/chats/decline-chat-invite",
      {
        queryParameters: {
          username: sessionStorage.getItem("username") as string,
        },
        body: { chatId },
      }
    );

    // Remove the chat invite from ChatPreviewList
    if (response.ok) {
      setChats((chats) => chats.filter((chat) => chat.chat_id !== chatId));
    }
  };

  return (
    <div className="chat-invite">
      <small className="secondary">
        <span style={{ fontSize: "1.4rem" }} className="primary">
          {creator}
        </span>{" "}
        is inviting you to chat...
      </small>
      <div className="chat-invite-options">
        <button className="button" onClick={handleAccept}>
          Accept
        </button>
        <button className="outline-button" onClick={handleDecline}>
          Decline
        </button>
      </div>
    </div>
  );
}

export default ChatInvite;
