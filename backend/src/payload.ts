import crypto from "crypto";

export class Payload {
  type: string;

  constructor(type: string = "") {
    this.type = type;
  }
}

export class GreetPayload extends Payload {
  username: string;

  constructor(username: string) {
    super("GREET");
    this.username = username;
  }
}

export class MessagePayload extends Payload {
  id: string;
  chatId: string;
  sender: string;
  recipients: string[];
  content: string;
  timestamp: number;

  constructor(sender: string, recipients: string[], content: string) {
    super("MESSAGE");
    this.id = crypto.randomUUID().toString();
    this.chatId = [...sender, ...recipients].sort().join(":");
    this.sender = sender;
    this.recipients = [...recipients];
    this.content = content;
    this.timestamp = Date.now();
  }
}

export class DeletePayload extends Payload {
  messagePayloadIds: string[];

  constructor(messagePayloadIds: string[]) {
    super("DELETE");
    this.messagePayloadIds = messagePayloadIds;
  }
}
