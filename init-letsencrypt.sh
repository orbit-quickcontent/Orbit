#!/bin/bash
# A script to bootstrap Let's Encrypt SSL certificates for Nginx in Docker Compose

if ! [ -x "$(command -v docker-compose)" ]; then
  echo 'Error: docker-compose is not installed.' >&2
  exit 1
fi

domains=(yourdomain.com www.yourdomain.com)
rsa_key_size=4096
data_path="./data/certbot"
email="support@yourdomain.com" # Adding support email as requested
staging=0 # Set to 1 if you're testing to avoid hitting request limits

if [ -d "$data_path" ]; then
  read -p "Existing data found for $domains. Continue and replace existing certificates? (y/N) " decision
  if [ "$decision" != "Y" ] && [ "$decision" != "y" ]; then
    exit
  fi
fi

if [ ! -e "$data_path/conf/options-ssl-nginx.conf" ] || [ ! -e "$data_path/conf/ssl-dhparams.pem" ]; then
  echo "### Downloading recommended TLS parameters..."
  mkdir -p "$data_path/conf"
  curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot-nginx/certbot_nginx/_internal/tls_configs/options-ssl-nginx.conf > "$data_path/conf/options-ssl-nginx.conf"
  curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot/certbot/ssl-dhparams.pem > "$data_path/conf/ssl-dhparams.pem"
  echo
fi

echo "### Creating dummy certificate for $domains..."
path="/etc/letsencrypt/live/$domains"
mkdir -p "$data_path/conf/live/$domains"
docker-compose -f docker-compose.prod.yml run --entrypoint \
  "openssl req -x509 -nodes -newkey rsa:2048 -days 1\
    -keyout '$path/privkey.pem' \
    -out '$path/fullchain.pem' \
    -subj '/CN=localhost'" nginx
echo

echo "### Starting nginx..."
docker-compose -f docker-compose.prod.yml up --force-recreate -d nginx
echo

echo "### Deleting dummy certificate for $domains..."
docker-compose -f docker-compose.prod.yml run --entrypoint \
  "rm -Rf /etc/letsencrypt/live/$domains && \
   rm -Rf /etc/letsencrypt/archive/$domains && \
   rm -Rf /etc/letsencrypt/renewal/$domains.conf" nginx
echo


echo "### Requesting Let's Encrypt certificate for $domains..."
# Join $domains to -d args
domain_args=""
for domain in "${domains[@]}"; do
  domain_args="$domain_args -d $domain"
done

# Select appropriate email arg
email_arg="--register-unsafely-without-email"
if [ -n "$email" ]; then email_arg="--email $email"; fi

# Enable staging mode if requested
staging_arg=""
if [ $staging -ne 0 ]; then staging_arg="--staging"; fi

docker-compose -f docker-compose.prod.yml run --entrypoint \
  "certbot certonly --webroot -w /var/www/certbot \
    $staging_arg \
    $email_arg \
    $domain_args \
    --rsa-key-size $rsa_key_size \
    --agree-tos \
    --force-renewal --non-interactive" nginx
echo

echo "### Reloading nginx..."
docker-compose -f docker-compose.prod.yml exec nginx nginx -s reload
