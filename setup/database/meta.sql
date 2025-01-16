
-- Create database and user
CREATE DATABASE IF NOT EXISTS bubble_dev;
CREATE USER IF NOT EXISTS 'dev'@'localhost' IDENTIFIED BY 'dev';
GRANT ALL PRIVILEGES ON bubble_dev.* TO 'dev'@'localhost';
FLUSH PRIVILEGES;