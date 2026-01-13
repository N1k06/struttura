#!/usr/bin/env bash

set -e

# Crea la directory per il PID di MariaDB
rm -rf ./mariadb_run
mkdir -p ./mariadb_run
chmod 777 ./mariadb_run

# Modifica i permessi per la creazione di file da php
chmod -R 777 ../src/api/php

# Riavvia i container in background eliminando i volumes
docker-compose -f docker-compose.yml down -v || true
docker-compose -f docker-compose.yml up --build -d

# Installa le dipendenze di Composer
docker-compose -f docker-compose.yml exec -T php-app composer install -d /var/www/html

# Aspetta che il container di MariaDB sia pronto
echo "Waiting for MariaDB to be ready..."
sleep 10

# Configura i permessi per l'accesso remoto a MariaDB
docker-compose -f docker-compose.yml exec -T db mariadb -u root -proot <<EOF
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' IDENTIFIED BY 'root';
FLUSH PRIVILEGES;
GRANT ALL PRIVILEGES ON *.* TO 'user'@'%' IDENTIFIED BY 'user';
FLUSH PRIVILEGES;
EOF
echo "MariaDB setup complete."

# Importa lo schema e i dati del database
docker-compose -f docker-compose.yml exec -T db mariadb -u root -proot <../src/api/db/schema.sql
echo "DB schema loaded."

docker-compose -f docker-compose.yml exec -T db mariadb -u root -proot <../src/api/db/data.sql
echo "DB populated."