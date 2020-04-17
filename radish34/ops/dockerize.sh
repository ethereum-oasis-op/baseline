#!/bin/bash

# party-agnostic
docker-compose build ganache geth-bootnode geth-node geth-miner1 geth-miner2

# party-specific, external dependencies
docker-compose build mongo-buyer mongo-supplier1 mongo-supplier2 redis-buyer redis-supplier1 redis-supplier2

git diff --exit-code --quiet HEAD ./api && if [ $? -ne 0 ] || [[ ! -dir ./api/node_modules ]]; then docker-compose build --no-cache api-buyer api-supplier1 api-supplier2; fi
git diff --exit-code --quiet HEAD ./deploy && if [ $? -ne 0 ] || [[ ! -dir ./deploy/node_modules ]]; then docker-compose build --no-cache deploy; fi
git diff --exit-code --quiet HEAD ./messenger && if [ $? -ne 0 ] || [[ ! -dir ./messenger/node_modules ]]; then docker-compose build --no-cache messenger-buyer messenger-supplier1 messenger-supplier2; fi
git diff --exit-code --quiet HEAD ./ui && if [ $? -ne 0 ] || [[ ! -dir ./ui/node_modules ]]; then docker-compose build --no-cache ui; fi
git diff --exit-code --quiet HEAD ./zkp && if [ $? -ne 0 ] || [[ ! -dir ./zkp/node_modules ]]; then docker-compose build --no-cache zkp; fi
