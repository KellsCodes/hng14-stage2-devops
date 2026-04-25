#!/bin/bash
set -e

SERVICE_NAME="frontend"
IMAGE_NAME="node_frontend:latest"
NEW_CONTAINER="${SERVICE_NAME}_new"
OLD_CONTAINER="${SERVICE_NAME}_active"

echo "Starting strict rolling update for $SERVICE_NAME..."

# 1. Start the NEW container on a temporary port so it doesn't conflict
echo "Starting new container..."
# We map it to 3001 temporarily so 3000 stays active for users
docker run -d --name "$NEW_CONTAINER" -p 3001:3000 "$IMAGE_NAME"

# 2. Guard the loop with a strict 60-second counter
SECONDS=0
MAX_WAIT=60
IS_HEALTHY=false

echo "Waiting for new container to become healthy..."
while [ $SECONDS -lt $MAX_WAIT ]; do
  STATUS=$(docker inspect --format='{{.State.Health.Status}}' "$NEW_CONTAINER" 2>/dev/null || echo "starting")
  echo "Current Status: $STATUS (${SECONDS}s / 60s)"
  
  if [ "$STATUS" == "healthy" ]; then
    IS_HEALTHY=true
    break
  fi
  
  sleep 5
  SECONDS=$((SECONDS+5))
done

# 3. Process criteria
if [ "$IS_HEALTHY" = true ]; then
  echo "New container is healthy! Swapping..."
  
  # Stop the OLD container ONLY after the new one is healthy
  if docker ps -a --format '{{.Names}}' | grep -q "^${OLD_CONTAINER}$"; then
    echo "Stopping old container..."
    docker stop "$OLD_CONTAINER"
    docker rm "$OLD_CONTAINER"
  fi
  
  # Rename the new container to become the active one
  docker rename "$NEW_CONTAINER" "$OLD_CONTAINER"
  
  echo "Rolling update completed successfully."
  exit 0
else
  echo "New container failed health checks within 60s!"
  echo "Aborting. Destroying new container and leaving the old one running."
  
  docker stop "$NEW_CONTAINER"
  docker rm "$NEW_CONTAINER"
  
  exit 1
fi
