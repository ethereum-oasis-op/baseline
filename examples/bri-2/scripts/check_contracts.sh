#!/bin/bash

echo "Checking for contracts/artifacts"
DIRECTORY="./contracts/artifacts"
if [ -d $DIRECTORY ]; then
    echo "  Directory '$DIRECTORY' exists. No action required."
else 
    echo "  Directory '$DIRECTORY' does not exist. Running contract compilation now."
    npm run contracts:compile
fi