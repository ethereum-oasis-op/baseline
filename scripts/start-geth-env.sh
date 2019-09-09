 #!/bin/bash

docker-compose -f ../geth-env/docker-compose.yml up --build geth-bootnode geth-dev-miner-1 geth-dev-miner-2 geth-dev-node-1 geth-dev-node-2 geth-dev-node-3 geth-explorer
