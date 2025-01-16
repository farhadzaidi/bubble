#!/bin/bash

# This script is used to setup the environment for DEVELOPMENT.
# It should only be used in development, and production will require manual
# environment configuration
# The script creates a MySQL development database for the project, an 
# authorized user for the database, and the database schema (tables) for the
# project.
# Additionally, the script also creates a .env file inside the 'backend' folder
# which contains various environment variables used throughout the project.
# Note that you will need MySQL installed on your system for this to work.

. utils.sh

cd database
. db_setup.sh

echo

cd ../environment
. env_setup.sh

cd ..
echo
echo -e "${SUCCESS}Setup completed successfully!${END}"