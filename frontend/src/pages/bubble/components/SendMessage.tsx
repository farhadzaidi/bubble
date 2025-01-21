function SendMessage() {
  return (
    <div className="send-message">
      <textarea placeholder="Message..."></textarea>
      <button type="submit" className="">
        Send
      </button>
    </div>
  );
}

export default SendMessage;
