#!/bin/bash

# Colors for output
SUCCESS='\033[38;5;28m'
ERROR='\033[38;5;196m'
INFO='\033[38;5;32m'
END='\033[0m'

# File paths
META_FILE="./meta.sql"
BUBBLE_FILE="./bubble.sql"
# DATA_FILE="./data.sql"
LEDGER_FILE="./ledger.sql"

check_file_exists() {
    if [[ ! -f "$1" ]]; then
        echo -e "${ERROR}File '$1' not found.${END}"
        # exit 1
    fi
}

check_file_exists "$META_FILE" 
check_file_exists "$BUBBLE_FILE"
# check_file_exists "$DATA_FILE"
check_file_exists "$LEDGER_FILE"

echo -e "\n${INFO}Creating databases and user...${END}"
if !(mysql -u root< "$META_FILE"); then
    echo -e "${ERROR}Failed to create database and user from ${META_FILE}.${END}"
    exit 1
fi

echo -e "\n${INFO}Creating bubble schema...${END}"
if !(mysql -u root < "$BUBBLE_FILE"); then
    echo -e "${ERROR}Failed to create schema from ${BUBBLE_FILE}.${END}"
    exit 1
fi

echo -e "\n${INFO}Creating ledger...${END}"
if !(mysql -u root < "$LEDGER_FILE"); then
    echo -e "${ERROR}Failed to create ledger from ${LEDGER_FILE}.${END}"
    exit 1
fi

# echo -e "\n${INFO}Populating tables with dummy data...${END}"
# if !(mysql -u root < "$DATA_FILE"); then
#     echo -e "${ERROR}Failed to populate tables from ${DATA_FILE}.${END}"
#     exit 1
# fi

echo -e "\n${SUCCESS}Database setup complete!${END}"
echo -e "\n${INFO}You can now connect using: mysql -u dev -p (Password: 'dev')${END}"