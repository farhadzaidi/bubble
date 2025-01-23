# Colors for output
SUCCESS='\033[38;5;28m'
ERROR='\033[38;5;196m'
INFO='\033[38;5;32m'
END='\033[0m'

# Function to check if file exists
check_file_exists() {
    if [[ ! -f "$1" ]]; then
        echo -e "${ERROR}File '$1' not found.${END}"
        # exit 1
    fi
}