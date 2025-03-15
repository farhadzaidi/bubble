import { useState } from "react";

type Props = {
  closeModal: () => void;
};

function CreateChatModal({ closeModal }: Props) {
  const [chatUsers, setChatUsers] = useState<string[]>([]);
  const [newChatUser, setNewChatUser] = useState("");
  const [inputError, setInputError] = useState("");

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

    setChatUsers([...chatUsers, newChatUser]);
    setNewChatUser("");
    setInputError("");
  };

  const removeChatUser = (userToRemove: string) => {
    setChatUsers((chatUsers) =>
      chatUsers.filter((username) => username !== userToRemove)
    );
  };

  return (
    <div className="create-chat-modal">
      <div className="create-chat-modal-content">
        <div className="create-chat-modal-header">
          <button onClick={closeModal} className="button">
            Cancel
          </button>
          <p>Add Users</p>
        </div>

        <div className="add-chat-users-list">
          {chatUsers.map((chatUser) => {
            return (
              <div>
                <p>{chatUser}</p>
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

        {/* Hit ledger to obtain  public keys*/}
        {/* Generate a symmetric encryption key and encrypt it with
        each user's public key */}
        {/* Hit API to create chat invites */}
        <button className="button">Submit</button>
      </div>
    </div>
  );
}

export default CreateChatModal;
