FROM php:8.4-cli-alpine

RUN apk add --no-cache \
        postgresql-dev libpq-dev libzip-dev oniguruma-dev icu-dev \
        libpng-dev libjpeg-turbo-dev freetype-dev libsodium-dev \
        git curl curl-dev unzip \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
        pdo pdo_pgsql pgsql mbstring intl zip gd bcmath opcache curl exif pcntl sodium

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app

COPY . .

RUN composer install --no-dev --optimize-autoloader --no-scripts \
    && chmod -R 777 storage bootstrap/cache \
    && mkdir -p storage/logs storage/framework/{sessions,views,cache}

EXPOSE 8000

CMD ["sh", "-c", "php artisan serve --host 0.0.0.0 --port ${PORT:-8000}"]