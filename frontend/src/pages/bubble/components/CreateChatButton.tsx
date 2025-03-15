import { useState } from "react";

import CreateChatModal from "./CreateChatModal";

function CreateChatButton() {
  const [isOpen, setIsOpen] = useState(false);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <>
      <button
        onClick={openModal}
        style={{ marginRight: "auto" }}
        className="button"
      >
        New Chat
      </button>
      {isOpen && <CreateChatModal closeModal={closeModal} />}
    </>
  );
}

export default CreateChatButton;

// Load up modal
// Can enter usernames
// Name chat
// On submit, hit ledger to get public keys
// - Handle any username not found errors
// Create a random symmetric encryption key and encrypt it with
// each user's public key
// Hit API to create a group invite
// Group gets created and users are part of a group when they accept the invite
// Encrypted symmetric encrypted key gets saved for each user in the database
// On login, it gets decrypted using their password
// This key is used to send messages and receive (encrypt/decrypt) messages
