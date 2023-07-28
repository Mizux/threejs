#!/usr/bin/env bash
set -euo pipefail

command -v docker

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

# Build image
docker build -t three .

# Run container
docker run --rm --init \
 -p 8080:8080 \
 -v "${SCRIPT_DIR}":/home/node/app \
 -it \
 --name three \
 three:latest
