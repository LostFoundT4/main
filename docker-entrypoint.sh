#!/bin/bash

if [ "$DATABASE" = "django.db.backends.postgresql" ]
then
    echo "Waiting for postgres..."

    while ! nc -z $SQL_HOST $SQL_PORT; do
      sleep 0.1
    done

    echo "PostgreSQL started"
fi

mkdir /usr/share/ssl_certs
chmod 755 /usr/share/ssl_certs

exec "$@"