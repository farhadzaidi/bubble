# Dockerized MySQL and Redis

This setup simplifies development by containerizing **MySQL** and **Redis**, eliminating 
configuration inconsistencies across different systems. Only **Docker** is required
for it to work on virtually any machine.

The **schema.sql** file is used to populate the MySQL database with the schema required
for the app to work. Note that this is meant to be used for **development only** 
and  the configuration for the containers and the schema should be different in production.

To get started, simply run the following command in this directory.
```sh
docker-compose up -d