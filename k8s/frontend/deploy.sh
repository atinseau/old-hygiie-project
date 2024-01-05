#!/bin/bash

# Variables
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
ROOT_DIR=$( cd $SCRIPT_DIR/../.. && pwd )

FRONTEND_IMAGE="ch-frontend"
FRONTEND_TAG="latest"
FRONTEND_RELEASE="${FRONTEND_IMAGE}-release"

# Change directory to script directory
cd $SCRIPT_DIR

# Build docker image

docker build \
  -t $FRONTEND_IMAGE:$FRONTEND_TAG \
  -f docker/build.Dockerfile \
  $ROOT_DIR


# Helm install
HELM_ARGS="$FRONTEND_RELEASE ./helm/ -n local -f $ROOT_DIR/k8s/values.yaml --set frontend.ingress.host=\"ch-frontend.local.com\""
HELM_DIFF=$(helm diff upgrade $HELM_ARGS --allow-unreleased | wc -l)

if [ "$HELM_DIFF" -gt 0 ]; then
  helm upgrade \
    $HELM_ARGS \
    --create-namespace \
    --install
else
  echo "No changes detected"
fi