#!/bin/bash

source ../utils.sh || exit 1

# File paths
META_FILE="./meta.sql"
SCHEMA_FILE="./schema.sql"
DATA_FILE="./data.sql"

check_file_exists "$META_FILE" 
check_file_exists "$SCHEMA_FILE"
check_file_exists "$DATA_FILE"

echo -e "\n${INFO}Creating database and user...${END}"
if !(mysql -u root< "$META_FILE"); then
    echo -e "${ERROR}Failed to create database and user from ${META_FILE}.${END}"
    exit 1
fi

echo -e "\n${INFO}Creating schema...${END}"
if !(mysql -u root < "$SCHEMA_FILE"); then
    echo -e "${ERROR}Failed to create schema from ${SCHEMA_FILE}.${END}"
    exit 1
fi

echo -e "\n${INFO}Populating tables with dummy data...${END}"
if !(mysql -u root < "$DATA_FILE"); then
    echo -e "${ERROR}Failed to populate tables from ${DATA_FILE}.${END}"
    exit 1
fi

echo -e "\n${SUCCESS}Database setup complete!${END}"
echo -e "${INFO}You can now connect using: mysql -u dev -p (Password: 'dev')${END}\n"
