FROM mysql

COPY scripts/schema.sql /docker-entrypoint-initdb.d/
