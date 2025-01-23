#!/bin/bash

# This script creates a mysql database on the local machine populated with the
# required schema for the backend to work (mysql must be installed on the machine).
# This is only meant to be used for DEVELOPMENT

# Note: This script uses the mysql root password to authenticate the root user.
# If you are using auth socket (sudo) to authenticate, you must remove the -p
# flag on all commands and run the setup script with sudo.

# The script creates the following if they don't already exist:
#   - 'bubble_dev' database
#   - 'dev' user with password 'dev' - has all privileges on bubble_dev
#   - All of the tables in schema.sql

# Additionally, the tables are populated with some dummy data which is required
# for testing

#!/bin/bash
source ../utils.sh || exit 1

# File paths
META_FILE="./meta.sql"
SCHEMA_FILE="./schema.sql"
DATA_FILE="./data.sql"

check_file_exists "$META_FILE" 
check_file_exists "$SCHEMA_FILE"
check_file_exists "$DATA_FILE"

# echo -e "\n${INFO}Creating database and user...${END}"
# if !(mysql -u root -p < "$META_FILE"); then
#     echo -e "${ERROR}Failed to create database and user from ${META_FILE}.${END}"
#     exit 1
# fi

# echo -e "\n${INFO}Creating schema...${END}"
# if !(mysql -u root -p < "$SCHEMA_FILE"); then
#     echo -e "${ERROR}Failed to create schema from ${SCHEMA_FILE}.${END}"
#     exit 1
# fi

echo -e "\n${INFO}Populating tables with dummy data...${END}"
if !(mysql -u root -p < "$DATA_FILE"); then
    echo -e "${ERROR}Failed to populate tables from ${DATA_FILE}.${END}"
    exit 1
fi

echo -e "\n${SUCCESS}Database setup complete!${END}"
echo -e "${INFO}You can now connect using: mysql -u dev -p (Password: 'dev')${END}\n"
