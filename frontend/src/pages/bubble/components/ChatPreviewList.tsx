import { useEffect, useState } from "react";
import { makeApiCall } from "../../../utils/api";
import ChatPreview from "./ChatPreview";

type Chat = {
  chat_id: string;
  chat_name: string;
};

function ChatPreviewList() {
  const [chats, setChats] = useState<Chat[]>([]);

  // Get chats
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

  const MAX_LENGTH = Math.floor(window.innerWidth * 0.02);
  console.log(MAX_LENGTH);
  return (
    <div className="chat-preview-list">
      {chats.map((chat) => {
        let name = chat.chat_name;
        if (name.length > MAX_LENGTH) {
          name = name.slice(0, MAX_LENGTH - 3) + "...";
        }
        return (
          <ChatPreview key={chat.chat_id} chatName={name} numNewMessages={0} />
        );
      })}
    </div>
  );
}

export default ChatPreviewList;
