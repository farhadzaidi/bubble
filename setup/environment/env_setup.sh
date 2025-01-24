#!/bin/bash

source ../utils.sh

SOURCE="./variables"
DEST="../../backend/.env"

echo -e $"${INFO}Creating .env file...${END}"

check_file_exists "$SOURCE"

if cp "$SOURCE" "$DEST"; then
    echo -e "${SUCCESS}Successfully created .env file!${END}"
else
    echo -e "${ERROR}Failed to create .env file...${END}"
    exit 1
fi