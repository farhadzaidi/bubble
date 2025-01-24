
USE bubble_dev;

DROP TABLE IF EXISTS UserChats;
DROP TABLE IF EXISTS MessageViewers;
DROP TABLE IF EXISTS Messages;
DROP TABLE IF EXISTS Users;
DROP TABLE IF EXISTS Chats;

-- Tables

CREATE TABLE Users(
  username VARCHAR(16) PRIMARY KEY,
  password_hash VARCHAR(256) NOT NULL
);

CREATE TABLE Chats(
  chat_id VARCHAR(256) PRIMARY KEY,
  chat_name VARCHAR(512) NOT NULL,
  type ENUM('direct', 'group') NOT NULL DEFAULT 'direct'
);

CREATE TABLE Messages(
  message_id VARCHAR(64) PRIMARY KEY,
  chat_id VARCHAR(256) NOT NULL,
  sender VARCHAR(16) NOT NULL,
  content text NOT NULL,
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  FOREIGN KEY (sender) REFERENCES Users(username)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  FOREIGN KEY (chat_id) REFERENCES Chats(chat_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

-- Junction Tables

CREATE TABLE UserChats(
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

CREATE TABLE MessageViewers(
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