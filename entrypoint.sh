#!/bin/sh
set -e

# Jika ada template, convert jadi config.js
if [ -f /usr/share/nginx/html/config.template.js ]; then
  echo "Generating config.js from config.template.js..."
  # gunanya: envsubst menggantikan ${VITE_API_URL} dsb
  envsubst < /usr/share/nginx/html/config.template.js > /usr/share/nginx/html/config.js
else
  echo "No config.template.js found, skipping..."
fi

# Start nginx
exec nginx -g "daemon off;"
