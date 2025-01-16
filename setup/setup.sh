#!/bin/bash

# This script sets up the environment for the project. It creates a MySQL
# database on the local machine with a user to access the database, all the
# required tables, and some dummy data for testing
# Note: MySQL is required for the script to wrok

# Additionally, the script creates a .env with all the required environment
# variables in the backend folder of the project

. utils.sh

cd database
. db_setup.sh

echo

cd ../environment
. env_setup.sh

cd ..
echo
echo -e "${SUCCESS}Setup completed successfully!${END}"