import { useEffect, useState } from "react";
import { makeApiCall } from "../../../utils/api";
import ChatPreview from "./ChatPreview";

type Chat = {
  chat_id: string;
  chat_name: string;
};

type Props = {
  setChatId: React.Dispatch<React.SetStateAction<string>>;
};

function ChatPreviewList({ setChatId }: Props) {
  const [chats, setChats] = useState<Chat[]>([]);

  // Get chats by username
  useEffect(() => {
    (async () => {
      let response = await makeApiCall("GET", "/chats/get-chats-by-user", {
        queryParameters: {
          username: sessionStorage.getItem("username") as string,
        },
      });
      const json = await response.json();
      setChats(json);
    })();
  }, []);

  // TODO: make this dynamic
  const MAX_LENGTH = Math.floor(window.innerWidth * 0.02);
  return (
    <div className="chat-preview-list">
      {chats.map((chat) => {
        let name = chat.chat_name;
        if (name.length > MAX_LENGTH) {
          name = name.slice(0, MAX_LENGTH - 3) + "...";
        }
        return (
          <ChatPreview
            key={chat.chat_id}
            chatId={chat.chat_id}
            chatName={name}
            numNewMessages={0}
            setChatId={setChatId}
          />
        );
      })}
    </div>
  );
}

export default ChatPreviewList;
