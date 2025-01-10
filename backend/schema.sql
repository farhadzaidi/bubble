
-- Tables

CREATE TABLE Users (
  username VARCHAR(16) PRIMARY KEY,
  password_hash VARCHAR(256) NOT NULL
);

CREATE TABLE Chats (
  chat_id VARCHAR(256) PRIMARY KEY,
  type ENUM('direct', 'group') NOT NULL DEFAULT 'direct'
);

CREATE TABLE Messages(
  message_id VARCHAR(64) PRIMARY KEY,
  chat_id VARCHAR(256) NOT NULL,
  sender VARCHAR(16) NOT NULL,
  content text NOT NULL,
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  FOREIGN KEY (sender) REFERENCES Users(username),
  FOREIGN KEY (chat_id) REFERENCES Chats(chat_id)
);

 --- Junction Tables

CREATE TABLE MessageRecipients(
  message_id VARCHAR(64) NOT NULL,
  username VARCHAR(16) NOT NULL,
  PRIMARY KEY (message_id, username),
  FOREIGN KEY (message_id) REFERENCES Messages(message_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  FOREIGN KEY (username) REFERENCES Users(username)
    ON DELETE CASCADE
    ON UPDATE CASCADE
 );

CREATE TABLE UserChats (
  username VARCHAR(16) NOT NULL,
  chat_id VARCHAR(256) NOT NULL,
  PRIMARY KEY (username, chat_id),
  FOREIGN KEY (username) REFERENCES Users(username) 
    ON DELETE CASCADE 
    ON UPDATE CASCADE,
  FOREIGN KEY (chat_id) REFERENCES Chats(chat_id) 
    ON DELETE CASCADE 
    ON UPDATE CASCADE
);