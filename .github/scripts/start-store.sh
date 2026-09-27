#!/usr/bin/env bash
# Starts the EBAC store (WordPress + database) and waits until it responds.
set -euo pipefail

docker network create --attachable ebac-network
docker run -d --name wp_db --network ebac-network ernestosbarbosa/lojaebacdb:latest
docker run -d --name wp -p 80:80 --network ebac-network ernestosbarbosa/lojaebac:latest

echo "Waiting for the store to be ready..."
for attempt in $(seq 1 60); do
  if curl -sf -o /dev/null http://localhost/; then
    echo "Store is ready."
    exit 0
  fi
  sleep 5
done

echo "The store did not start in time. Last logs:"
docker logs wp | tail -50
exit 1