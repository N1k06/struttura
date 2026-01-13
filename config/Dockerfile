# Using the PHP 8.4 as Apache base image
FROM php:8.4-apache

# Aggiorna i pacchetti e installa le dipendenze di sistema (unzip e librerie per zip)
RUN apt-get update && apt-get install -y \
    libzip-dev \
    unzip \
    && rm -rf /var/lib/apt/lists/*

# Enable the Apache module rewrite
RUN a2enmod rewrite

# Install PHP extensions (incluso zip per Composer)
RUN docker-php-ext-install mysqli pdo_mysql pdo zip

# Install Composer
# Nota: Puoi usare direttamente la riga COPY --from per semplicità
COPY --from=composer:latest /usr/bin/composer /usr/local/bin/composer

# Install XDebug 
RUN pecl install xdebug && docker-php-ext-enable xdebug

#COPY ./php_config/docker-php-ext-xdebug.ini /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini
