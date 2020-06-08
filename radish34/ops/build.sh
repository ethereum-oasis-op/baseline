#!/bin/bash

git diff --exit-code --quiet HEAD ./package.json
if [ $? -ne 0 ] || [[ ! -d ./node_modules ]]
then
  npm ci
fi

./ops/build_api.sh
./ops/build_contracts.sh
./ops/build_deploy.sh
./ops/build_messenger.sh
./ops/build_ui.sh
./ops/build_zkp.sh
