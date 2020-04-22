#!/bin/bash

# party-agnostic
docker-compose build ganache geth-bootnode geth-node geth-miner1 geth-miner2

# party-specific, external dependencies
docker-compose build mongo-buyer mongo-supplier1 mongo-supplier2 redis-buyer redis-supplier1 redis-supplier2

docker-compose build --no-cache api-buyer api-supplier1 api-supplier2
docker-compose build --no-cache deploy
docker-compose build --no-cache messenger-buyer messenger-supplier1 messenger-supplier2
docker-compose build --no-cache ui
docker-compose build --no-cache zkp
