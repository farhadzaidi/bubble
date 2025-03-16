import { useState } from "react";
import { makeApiCall } from "../../../utils/api";

import Loading from "../../../components/Loading";

type Props = {
  closeModal: () => void;
};

function CreateChatModal({ closeModal }: Props) {
  const [chatUsers, setChatUsers] = useState<string[]>([]);
  const [newChatUser, setNewChatUser] = useState("");
  const [inputError, setInputError] = useState("");
  const [invalidUsernames, setInvalidUsernames] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

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

    const response = await makeApiCall(true, "POST", "/get-public-keys", {
      body: {
        usernames: JSON.stringify(chatUsers),
      },
    });

    // Here, we are fetching public keys based on provided usernames and
    // ensuring that the user hasn't provided any invalid usernames
    const json = await response.json();
    const confirmedUsernames: string[] = json.map(
      (user: { username: string; public_key: string }) => user.username
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

    setInputError("");

    // We are good to create the chat now
    // hit api
    // api will create a new chat entry
    // it will also create userchats junction table for each provided user
    // the junction table will have user and chat info along with:
    // encrypted symmetric encryption key provided by the inviter
    // AES generated encryption key which itself is encrypted by the user's public key
    // joined status which will be no by default

    setLoading(false);
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
