#!/bin/bash

# Settings
DOMAIN="school.sport.mos.ru"
TARGET_DIR="/var/www/$DOMAIN"
SOURCE_DIR="$(pwd)/.." 

# Colors
GREEN='\033[0;32m'
NC='\033[0m'

echo -e "${GREEN}Starting FULL RELEASE deployment for $DOMAIN...${NC}"

# 1. Copy EVERYTHING
echo "Copying full site..."
sudo cp -r $SOURCE_DIR/* $TARGET_DIR/

# 2. Exclude server scripts from public dir (security)
sudo rm -rf $TARGET_DIR/server-deploy
sudo rm -rf $TARGET_DIR/README.md
sudo rm -rf $TARGET_DIR/package.json
sudo rm -rf $TARGET_DIR/node_modules
sudo rm -rf $TARGET_DIR/tailwind.config.js

# 3. Ensure index.html is the real one (overwrite if coming-soon was there)
cp $SOURCE_DIR/index.html $TARGET_DIR/index.html

# 4. Set permissions
sudo chown -R www-data:www-data $TARGET_DIR
sudo chmod -R 755 $TARGET_DIR

echo -e "${GREEN}Full site deployed successfully!${NC}"
echo "Run: sudo systemctl reload nginx"
