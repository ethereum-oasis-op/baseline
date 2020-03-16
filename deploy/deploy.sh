#!/bin/sh
cp -r ./src/config/backups/* ./src/config/
node ./src/deploy.js done
