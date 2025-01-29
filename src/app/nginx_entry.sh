#!/bin/sh
echo "Création du lien symbolique..."
ln -ds /app/myproject/static /usr/share/nginx/html/

chmod -R 755 /app/myproject/static

cp ./app/nginx.conf /etc/nginx/nginx.conf
cp ./app/default.conf /etc/nginx/conf.d/default.conf
mkdir -p /etc/nginx/ssl

if [ ! -f /etc/nginx/ssl/ft_attribute.crt ]; then
    echo "Génération du certificat SSL..."
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout /etc/nginx/ssl/ft_attribute.key \
        -out /etc/nginx/ssl/ft_attribute.crt \
        -subj "/C=FR/ST=NA/L=Angouleme/O=42/OU=42/CN=ft_attribute.fr/UID=ltouzali"
fi
exec nginx -g "daemon off;"
