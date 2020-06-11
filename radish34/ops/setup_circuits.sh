#!/bin/bash

set -e

GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

docker-compose up --no-recreate -d zkp
./ops/await_stack.sh

if [ "$1" = "" ]; then
  printf "\nNo circuit selector provided. Defaulting to createMSA/createPO circuits.\n"
  circuit_selector=0
else
  circuit_selector=$1
fi
  
if [ "$circuit_selector" = "0" ] && [ ! -d ./zkp/output/createMSA ]; then
    sleep 5
    printf "\n${GREEN}*** Running setup for createMSA ***${NC}\n"
    curl -d '{"filepath": "business-logic/createMSA.zok"}' -H "Content-Type: application/json" -X POST http://localhost:8080/generate-keys
    printf "\n${GREEN}*** createMSA setup complete ***${NC}\n"
elif [ "$circuit_selector" = "1" ] && [ ! -d ./zkp/output/createDummyMSA ]; then
    sleep 5
    printf "\n${GREEN}*** Running setup for createDummyMSA ***${NC}\n"
    curl -d '{"filepath": "dummy-circuits/createDummyMSA.zok"}' -H "Content-Type: application/json" -X POST http://localhost:8080/generate-keys
    printf "\n${GREEN}*** createDummyMSA setup complete ***${NC}\n"
fi

if [ "$circuit_selector" = "0" ] && [ ! -d ./zkp/output/createPO ]; then
    sleep 5
    printf "\n${GREEN}*** Running setup for createPO ***${NC}\n"
    curl -d '{"filepath": "business-logic/createPO.zok"}' -H "Content-Type: application/json" -X POST http://localhost:8080/generate-keys
    printf "\n${GREEN}*** createPO setup complete ***${NC}\n"
elif [ "$circuit_selector" = "1" ] && [ ! -d ./zkp/output/createDummyPO ]; then
    sleep 5
    printf "\n${GREEN}*** Running setup for createDummyPO ***${NC}\n"
    curl -d '{"filepath": "dummy-circuits/createDummyPO.zok"}' -H "Content-Type: application/json" -X POST http://localhost:8080/generate-keys
    printf "\n${GREEN}*** createDummyPO setup complete ***${NC}\n"
fi
