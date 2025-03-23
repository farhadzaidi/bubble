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
