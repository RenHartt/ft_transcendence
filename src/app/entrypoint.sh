#!/bin/sh
echo "Waiting for postgres..."
while ! nc -z $DB_HOST $DB_PORT; do
  sleep 0.1
done
echo "PostgreSQL started"

echo "Applying database migrations..."
while ! python manage.py migrate --noinput 2>&1; do
  sleep 0.1
done
export DJANGO_SETTINGS_MODULE=myproject.settings

echo "Database migrations applied"

echo "Creating superuser..."
python manage.py shell << END
from django.contrib.auth import get_user_model

User = get_user_model()
import os

username = os.getenv('DJANGO_SUPERUSER_USERNAME')
email = os.getenv('DJANGO_SUPERUSER_EMAIL')
password = os.getenv('DJANGO_SUPERUSER_PASSWORD')

if not User.objects.filter(username=username).exists():
    User.objects.create_superuser(username=username, email=email, password=password)
    print(f"Superuser '{username}' created successfully!")
END
echo "Superuser created"

echo "Starting Django server..."
exec "$@"
