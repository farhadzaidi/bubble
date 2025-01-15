#!/bin/bash

# This script creates a mysql database on the local machine with the required
# schema for the backend to work. It is only meant to be used for development
# since production requires slightly different (secure) configuration.
# Note: mysql is required to be installed on the system with a root password
# and the script must be run from the 'database' directory.

# The script creates the following if they don't already exist:
#   - 'bubble_dev' database
#   - 'dev' user with password 'dev' - has all privileges on bubble_dev
#   - All of the tables in schema.sql

# Additionally, the tables are populated with some dummy data which is required
# for testing

#!/bin/bash

# File paths
META_FILE="./meta.sql"
SCHEMA_FILE="./schema.sql"

# Colors for output
SUCCESS='\033[38;5;28m'
ERROR='\033[38;5;196m'
INFO='\033[38;5;32m'
END='\033[0m'

# Function to check if a file exists
check_file_exists() {
    if [[ ! -f "$1" ]]; then
        echo -e "${ERROR}File '$1' not found.${END}"
        exit 1
    fi
}

# Check if required files exist
check_file_exists "$META_FILE"
check_file_exists "$SCHEMA_FILE"

# Step 1: Create database and user
echo -e "${INFO}Step 1: Creating database and user... (root password required)${END}"
if mysql -u root -p < "$META_FILE"; then
    echo -e "${SUCCESS}Successfully created database and user.${END}"
else
    echo -e "${ERROR}Failed to create database and user.${END}"
    exit 1
fi

echo

# Step 2: Create schema
echo -e "${INFO}Step 2: Creating schema... (root password required)${END}"
if mysql -u root -p < "$SCHEMA_FILE"; then
    echo -e "${SUCCESS}Successfully created schema.${NC}"
else
    echo -e "${ERROR}Failed to create schema.${NC}"
    exit 1
fi

echo

echo -e "${SUCCESS}All tasks completed successfully!${END}"
echo "${INFO}You can now connect using: mysql -u dev -p (Password: 'dev')${END}"
