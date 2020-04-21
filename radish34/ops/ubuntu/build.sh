#!/bin/bash

git diff --exit-code --quiet HEAD ./package.json && if [ $? -ne 0 ] || [[ ! -d ./node_modules ]]; then npm ci; fi

./ops/ubuntu/build_api.sh
./ops/ubuntu/build_contracts.sh
./ops/ubuntu/build_deploy.sh
./ops/ubuntu/build_messenger.sh
./ops/ubuntu/build_ui.sh
./ops/ubuntu/build_zkp.sh
