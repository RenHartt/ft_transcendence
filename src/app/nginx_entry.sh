#!/bin/sh
echo "Création du lien symbolique..."
ln -nfs /app/myproject/static /usr/share/nginx/html/

exec nginx -g "daemon off;"
