#!/bin/sh

set -e

echo "Deployment started."

# Build, tag, and push Docker Image to Docker Hub
ORG="openworklabs"
IMAGE="filecoin-web-wallet"
VERSION=$(cat package.json \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g' \
  | tr -d '[[:space:]]')

echo $ORG/$IMAGE:$VERSION
docker build -f Dockerfile -t $ORG/$IMAGE:$VERSION .
echo "$DOCKER_PWORD" | docker login -u "$DOCKER_USER" --password-stdin
docker push $ORG/$IMAGE

# Script to stop old container and run new one with new image on Docker Hub
SCRIPT="cd filecoin-web-wallet; git pull origin primary; VERSION=$(cat package.json \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g' \
  | tr -d '[[:space:]]'); docker pull openworklabs/filecoin-web-wallet:"$VERSION"; docker stop filecoin-web-wallet; docker rm filecoin-web-wallet; docker run -d --name filecoin-web-wallet -p 3000:3000 openworklabs/filecoin-web-wallet:"$VERSION"; exit"

ssh -i $HOME/deploy_key root@174.138.44.58 "${SCRIPT}"
