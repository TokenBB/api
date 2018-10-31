#!/bin/bash

# load variables from .env file
export $(grep -v '^#' .env | xargs)

url=$MYSQL_HOST
user=$MYSQL_USER
database=$ACCOUNT_NAME

schema="$(cat services/db/schema.sql)"
sql="create database if not exists $database; use $database; $schema"

MYSQL_PWD=$MYSQL_PASSWORD mysql -h $url -u $user -e "$sql"
