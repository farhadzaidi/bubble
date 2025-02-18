
CREATE DATABASE IF NOT EXISTS bubble_dev;
CREATE DATABASE IF NOT EXISTS ledger_dev;

CREATE USER IF NOT EXISTS 'dev'@'localhost' IDENTIFIED BY 'dev';

-- In production, priveleges should be fine-tuned, especially for the ledger.
GRANT ALL PRIVILEGES ON bubble_dev.* TO 'dev'@'localhost';
GRANT ALL PRIVILEGES ON ledger_dev.* TO 'dev'@'localhost';