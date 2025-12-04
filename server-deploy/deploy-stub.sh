#!/bin/bash

# Settings
DOMAIN="school.sport.mos.ru"
TARGET_DIR="/var/www/$DOMAIN"
SOURCE_DIR="$(pwd)/.." # Assuming script is run from server-deploy/ folder

# Colors
GREEN='\033[0;32m'
NC='\033[0m'

echo -e "${GREEN}Starting STUB deployment for $DOMAIN...${NC}"

# 1. Create directory
sudo mkdir -p $TARGET_DIR
sudo chown -R $USER:$USER $TARGET_DIR

# 2. Copy Assets, CSS, JS
echo "Copying static files..."
cp -r $SOURCE_DIR/assets $TARGET_DIR/
cp -r $SOURCE_DIR/css $TARGET_DIR/
cp -r $SOURCE_DIR/js $TARGET_DIR/

# 3. Copy Coming Soon as index.html
echo "Setting up Coming Soon page..."
cp $SOURCE_DIR/coming-soon.html $TARGET_DIR/index.html

# 4. Set permissions
sudo chown -R www-data:www-data $TARGET_DIR
sudo chmod -R 755 $TARGET_DIR

echo -e "${GREEN}Stub deployed successfully!${NC}"
echo "Next steps:"
echo "1. Ensure Nginx config is linked to /etc/nginx/sites-enabled/"
echo "2. Run: sudo nginx -t && sudo systemctl reload nginx"
