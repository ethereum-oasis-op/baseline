#!/bin/bash

if [ ! -d ./../config ]; then
    mkdir -p ./../config
    cp -r ./src/config/backups/* ./../config
    cp -r ./src/config/keystore ./../config
fi

node ./src/deploy.js done
