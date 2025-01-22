#!/bin/sh
echo "Création du lien symbolique..."
ln -nfs /app/myproject/static /usr/share/nginx/html/

chown -R www-data:www-data /app/myproject/static
chmod -R 755 /app/myproject/static

exec nginx -g "daemon off;"
