#!/bin/bash

# load variables from .env file
export $(grep -v '^#' .env | xargs)

url=$MYSQL_HOST
user=$MYSQL_USER
database=$ACCOUNT_NAME

MYSQL_PWD=$MYSQL_PASSWORD mysql -h $url -u $user
