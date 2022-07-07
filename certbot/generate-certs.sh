#!/bin/sh
docker-compose -f docker-compose.yml up -d --build
docker-compose down --remove-orphans
cp ./data/conf/live/solidguard.org/fullchain.pem ../proxy/certs/solidguard.crt
cp ./data/conf/live/solidguard.org/privkey.pem ../proxy/certs/solidguard.key
