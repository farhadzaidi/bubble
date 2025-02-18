USE ledger_dev;

DROP TABlE IF EXISTS PublicKeys;
DROP TRIGGER IF EXISTS prevent_update;
DROP TRIGGER IF EXISTS prevent_delete;
DROP TRIGGER IF EXISTS enforce_default_insert;

CREATE TABLE PublicKeys(
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(16) NOT NULL UNIQUE,
  public_key VARCHAR(64) NOT NULL UNIQUE,
  entry_hash VARCHAR(64) NOT NULL UNIQUE,
  prev_hash VARCHAR(64) UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

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
