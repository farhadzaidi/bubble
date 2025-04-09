import { useState, useEffect } from "react";
import { Socket } from "socket.io-client";
import ChatLog from "./ChatLog";
import SendMessage from "./SendMessage";
import { makeApiCall } from "../../../utils/api";
import { decryptWithPrivateKey } from "../../../utils/crypto";

type Props = {
  chatId: string;
  socket: Socket;
};

function ChatArea({ chatId, socket }: Props) {
  const [keyReady, setKeyReady] = useState(false);

  // Fetch symmetric encryption key
  useEffect(() => {
    // No need to fetch key if a chat hasn't been selected
    if (chatId == "") return;

    // No need to fetch key if it has already been cached
    if (sessionStorage.getItem(`symmetricKey:${chatId}`) !== null) {
      setKeyReady(true);
      return;
    }

    (async () => {
      const username = sessionStorage.getItem("username") as string;
      let response = await makeApiCall(
        false,
        "POST",
        "/chats/get-encryption-key",
        {
          queryParameters: { username },
          body: { chatId },
        }
      );

      let json = await response.json();
      const nonce = json.nonce;
      const encryptedSymmetricKey = json.encryptionKey;

      // Now we need to decrypt the encrypted symmetric key in order to be able to use it
      // To do this, we need the public key of the creator of the chat (to verify sender)

      // Fetch the username of the creator
      response = await makeApiCall(false, "GET", "/chats/get-chat-creator", {
        queryParameters: { chatId },
      });
      json = await response.json();

      // Fetch the creator's public key by username (from the ledger)
      response = await makeApiCall(true, "POST", "/get-public-keys", {
        body: { usernames: [json.creator] },
      });
      json = await response.json();

      // Decrypt symmetric key
      const symmetricKey = decryptWithPrivateKey(
        encryptedSymmetricKey,
        nonce,
        json[0].public_key,
        sessionStorage.getItem("privateKey") as string
      );
      sessionStorage.setItem(`symmetricKey:${chatId}`, symmetricKey);

      setKeyReady(true);
    })();
  }, [chatId]);

  return (
    <div className="chat-area">
      {!chatId ? (
        <div style={{ margin: "auto" }}>
          Select a chat to view and send messages
        </div>
      ) : (
        keyReady && (
          <>
            <ChatLog chatId={chatId} socket={socket} />
            <SendMessage chatId={chatId} socket={socket} />
          </>
        )
      )}
    </div>
  );
}

export default ChatArea;
