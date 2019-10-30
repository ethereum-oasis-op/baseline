 #!/bin/bash

docker-compose -f ../geth-env/docker-compose.yml up --build geth-bootnode geth-dev-miner-1 geth-dev-miner-2 geth-node-full-1 geth-node-full-2 geth-node-full-3 geth-explorer mongo
