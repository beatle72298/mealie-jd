#!/bin/bash

# Mealie Personal Build and Push Script
# Usage: ./build-and-push.sh [version]

set -e

# Configuration
REGISTRY="ghcr.io"
USERNAME="beatle72298"  # Your GitHub username
IMAGE_NAME="mealie-jd"
VERSION=${1:-"latest"}

echo "🔨 Building Mealie Personal v${VERSION}..."

# Build the image
docker build -f docker/Dockerfile -t ${REGISTRY}/${USERNAME}/${IMAGE_NAME}:${VERSION} .

# Also tag as latest if a specific version was provided
if [ "$VERSION" != "latest" ]; then
    docker tag ${REGISTRY}/${USERNAME}/${IMAGE_NAME}:${VERSION} ${REGISTRY}/${USERNAME}/${IMAGE_NAME}:latest
fi

echo "📤 Pushing to registry..."

# Push the image(s)
docker push ${REGISTRY}/${USERNAME}/${IMAGE_NAME}:${VERSION}

if [ "$VERSION" != "latest" ]; then
    docker push ${REGISTRY}/${USERNAME}/${IMAGE_NAME}:latest
fi

echo "✅ Successfully built and pushed ${REGISTRY}/${USERNAME}/${IMAGE_NAME}:${VERSION}"
echo ""
echo "To deploy, run:"
echo "  docker pull ${REGISTRY}/${USERNAME}/${IMAGE_NAME}:${VERSION}"
echo "  docker-compose -f docker-compose.personal.yml up -d"