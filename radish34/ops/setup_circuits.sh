#!/bin/bash

set -e

GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

docker-compose up --no-recreate -d zkp
./ops/await_stack.sh

if [ ! -d ./zkp/output/createMSA ]; then
    sleep 5

    printf "\n${GREEN}*** Running setup for createMSA ***${NC}\n"
    curl -d '{"filepath": "business-logic/createMSA.zok"}' -H "Content-Type: application/json" -X POST http://localhost:8080/generate-keys
    printf "\n${GREEN}*** createMSA setup complete ***${NC}\n"
fi

if [ ! -d ./zkp/output/createPO ]; then
    sleep 5

    printf "\n${GREEN}*** Running setup for createPO ***${NC}\n"
    curl -d '{"filepath": "business-logic/createPO.zok"}' -H "Content-Type: application/json" -X POST http://localhost:8080/generate-keys
    printf "\n${GREEN}*** createPO setup complete ***${NC}\n"
fi
