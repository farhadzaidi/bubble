USE bubble;

-- Main Bubble Database

-- Tables

CREATE TABLE Users(
  username VARCHAR(16) PRIMARY KEY,
  public_key VARCHAR(64) NOT NULL,
  salt VARCHAR(32) NOT NULL
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

-- Ledger Database

-- Main Table

CREATE TABLE PublicKeys(
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(16) NOT NULL UNIQUE,
  public_key VARCHAR(64) NOT NULL UNIQUE,
  entry_hash VARCHAR(64) NOT NULL UNIQUE,
  prev_hash VARCHAR(64) UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Triggers

DELIMITER //

CREATE TRIGGER prevent_update
BEFORE UPDATE ON PublicKeys
FOR EACH ROW
BEGIN
  SIGNAL SQLSTATE '45000'
  SET MESSAGE_TEXT = 'Updates are not allowed on this table.';
END//

CREATE TRIGGER prevent_delete
BEFORE DELETE ON PublicKeys
FOR EACH ROW
BEGIN
  SIGNAL SQLSTATE '45000'
  SET MESSAGE_TEXT = 'Deletions are not allowed on this table.';
END//

CREATE TRIGGER enforce_default_insert
BEFORE INSERT ON PublicKeys
FOR EACH ROW
BEGIN
  SET NEW.created_at = CURRENT_TIMESTAMP;
  IF NEW.id <> 0 THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'Manual ID insertion is not allowed on this table.';
  END IF;
END//

DELIMITER ;
