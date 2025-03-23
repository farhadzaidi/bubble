import { useState } from "react";
import { makeApiCall } from "../../../utils/api";

import Loading from "../../../components/Loading";
import {
  encryptWithPublicKey,
  generateSymmetricEncryptionKey,
} from "../../../utils/crypto";

type Props = {
  closeModal: () => void;
};

type LedgerInfoType = {
  username: string;
  public_key: string;
};

type EncryptionKeyType = {
  username: string;
  nonce: string;
  encryptionKey: string;
};

function CreateChatModal({ closeModal }: Props) {
  const [chatUsers, setChatUsers] = useState<string[]>([]);
  const [newChatUser, setNewChatUser] = useState("");
  const [inputError, setInputError] = useState("");
  const [invalidUsernames, setInvalidUsernames] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const createEncryptionKeys = (
    ledgerInfo: LedgerInfoType[]
  ): EncryptionKeyType[] => {
    const symmetricKey = generateSymmetricEncryptionKey();

    let encryptionKeys: EncryptionKeyType[] = [];
    for (const { username, public_key } of ledgerInfo) {
      const { nonce, encryptedSymmetricKey } = encryptWithPublicKey(
        symmetricKey,
        public_key,
        sessionStorage.getItem("privateKey") as string
      );

      encryptionKeys.push({
        username: username,
        nonce: nonce,
        encryptionKey: encryptedSymmetricKey,
      });
    }

    return encryptionKeys;
  };

  const handleChatUserChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    e.preventDefault();
    const usernameInput = e.target.value;
    if (usernameInput.length <= 16) setNewChatUser(e.target.value);
  };

  const addChatUser = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const username = newChatUser.trim();

    if (username === "") {
      setInputError("Username cannot be blank.");
      return;
    }

    if (chatUsers.includes(username)) {
      setInputError("Username has already been entered.");
      return;
    }

    const currentUsername = sessionStorage.getItem("username");
    if (username === currentUsername) {
      setInputError("You cannot enter your own username.");
      return;
    }

    setChatUsers([...chatUsers, newChatUser]);
    setNewChatUser("");
    setInputError("");
  };

  const removeChatUser = (userToRemove: string) => {
    setChatUsers((chatUsers) =>
      chatUsers.filter((username) => username !== userToRemove)
    );
  };

  const createChat = async () => {
    setLoading(true);

    // Ensure that at least one username has been entered
    if (chatUsers.length === 0) {
      setInputError("Please enter at least one username.");
      return;
    }

    // Make API call to ledger to get public keys
    const currentUsername = sessionStorage.getItem("username") as string;
    let response = await makeApiCall(true, "POST", "/get-public-keys", {
      body: {
        usernames: JSON.stringify([...chatUsers, currentUsername]),
      },
    });
    const ledgerInfo: LedgerInfoType[] = await response.json();

    // Ensure there are no invalid usernames
    const confirmedUsernames: string[] = ledgerInfo.map(
      (info) => info.username
    );
    const unconfirmedUsernames = chatUsers.filter(
      (username) => !confirmedUsernames.includes(username)
    );
    setInvalidUsernames(unconfirmedUsernames);
    if (unconfirmedUsernames.length > 0) {
      setInputError("Please remove or re-enter all invalid usernames.");
      setLoading(false);
      return;
    }
    setInputError(""); // No errors, can continue on

    // Make API call to create the chat
    const encryptionKeys = createEncryptionKeys(ledgerInfo);
    response = await makeApiCall(false, "POST", "/chats/create-chat", {
      queryParameters: { username: currentUsername },
      body: { encryptionKeys },
    });

    if (!response.ok) {
      setInputError((await response.json()).error);
      return;
    }

    setLoading(false);
    window.location.reload();
  };

  return (
    <div className="create-chat-modal">
      <div className="create-chat-modal-content">
        <div className="create-chat-modal-header">
          <button onClick={closeModal} className="outline-button">
            Cancel
          </button>
          <p>Add Users</p>
        </div>

        <div className="add-chat-users-list">
          {chatUsers.map((chatUser) => {
            return (
              <div key={chatUser}>
                <p
                  className={
                    invalidUsernames.includes(chatUser) ? "danger" : ""
                  }
                >
                  {chatUser}
                </p>
                <button
                  className="danger-button"
                  onClick={() => removeChatUser(chatUser)}
                >
                  Remove
                </button>
              </div>
            );
          })}
        </div>

        {/* Add User */}
        <form className="add-chat-users">
          <input
            type="text"
            placeholder="Username"
            value={newChatUser}
            onChange={handleChatUserChange}
          />
          <button onClick={addChatUser} type="submit" className="button">
            Add
          </button>
        </form>

        {inputError !== "" && <p className="danger">{inputError}</p>}

        {loading ? (
          <div className="text-center">
            <Loading />
          </div>
        ) : (
          <button onClick={createChat} className="button">
            Create
          </button>
        )}
      </div>
    </div>
  );
}

export default CreateChatModal;
