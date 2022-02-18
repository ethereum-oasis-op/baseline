#!/bin/bash

FILE="./commit-mgr/.env"
echo "Checking for commit-mgr/.env file."
if [ -f $FILE ]; then
    echo "  File '$FILE' exists. No action required."
else 
    echo "  File $FILE does not exist. Will copy contents from .env_example"
    cp ./commit-mgr/.env_example ./commit-mgr/.env
fi

FILE="./workflow-mgr/.env"
echo "Checking for workflow-mgr/.env file."
if [ -f $FILE ]; then
    echo "  File '$FILE' exists. No action required."
else 
    echo "  File $FILE does not exist. Will copy contents from .env_example"
    cp ./workflow-mgr/.env_example ./workflow-mgr/.env
fi

FILE="./zkp-mgr/.env"
echo "Checking for zkp-mgr/.env file."
if [ -f $FILE ]; then
    echo "  File '$FILE' exists. No action required."
else 
    echo "  File $FILE does not exist. Will copy contents from .env_example"
    cp ./zkp-mgr/.env_example ./zkp-mgr/.env
fi
