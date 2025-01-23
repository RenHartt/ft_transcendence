#!/bin/sh
echo "Création du lien symbolique..."
ln -ds /app/myproject/static /usr/share/nginx/html/

# sed -i 's/^user .*/user root;/' /etc/nginx/nginx.conf

# chown -R nginx:nginx /app/myproject/static
chmod -R 755 /app/myproject/static

cp ./app/nginx.conf /etc/nginx/nginx.conf
cp ./app/default.conf /etc/nginx/conf.d/default.conf

exec nginx -g "daemon off;"
