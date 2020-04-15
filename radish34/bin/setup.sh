#!/bin/sh
set -e

GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

printf "\n${GREEN}*** Starting zokrates container ***${NC}\n"
docker-compose up -d zkp

# delay needed to ensure all container are in running state.
sleep 10

printf "\n${GREEN}*** Running setup for createMSA ***${NC}\n"
curl -d '{"filepath": "business-logic/createMSA.zok"}' -H "Content-Type: application/json" -X POST http://radish34-zkp.docker/generate-keys

printf "\n${GREEN}*** Running setup for createPO ***${NC}\n"
curl -d '{"filepath": "business-logic/createPO.zok"}' -H "Content-Type: application/json" -X POST http://radish34-zkp.docker/generate-keys


printf "\n${GREEN}*** Setups complete ***${NC}\n"
