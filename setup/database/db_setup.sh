#!/bin/bash

# This script creates a mysql database on the local machine with the required
# schema for the backend to work. 
# It should only be used for DEVELOPMENT
# Note: mysql is required to be installed on the machine

# The script creates the following if they don't already exist:
#   - 'bubble_dev' database
#   - 'dev' user with password 'dev' - has all privileges on bubble_dev
#   - All of the tables in schema.sql

# Additionally, the tables are populated with some dummy data which is required
# for testing

#!/bin/bash
source ../utils.sh

# File paths
META_FILE="./meta.sql"
SCHEMA_FILE="./schema.sql"

# Create database and user
echo -e "${INFO}Creating database and user... (root password required)${END}"
check_file_exists "$META_FILE"
if mysql -u root -p < "$META_FILE"; then
    echo -e "${SUCCESS}Successfully created database and user.${END}"
else
    echo -e "${ERROR}Failed to create database and user.${END}"
    exit 1
fi

echo

# Create schema
echo -e "${INFO}Creating schema... (root password required)${END}"
check_file_exists "$SCHEMA_FILE"
if mysql -u root -p < "$SCHEMA_FILE"; then
    echo -e "${SUCCESS}Successfully created schema.${END}"
else
    echo -e "${ERROR}Failed to create schema.${END}"
    exit 1
fi

echo

echo -e "${SUCCESS}Database setup complete!${END}"
echo -e "${INFO}You can now connect using: mysql -u dev -p (Password: 'dev')${END}"
