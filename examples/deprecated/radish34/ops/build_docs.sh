#!/bin/bash

echo "Generating docs..."
BASE_DOCS='docs/generated'
if [ -d "$BASE_DOCS" ]; then rm -Rf $BASE_DOCS; fi

echo "    Smart contracts"
SC_DOCS="${BASE_DOCS}/contracts"
mkdir -p $SC_DOCS
npx solidity-docgen -i ./contracts -o $SC_DOCS --contract-pages --solc-settings "{remappings: ['openzeppelin-solidity=$PWD/node_modules/openzeppelin-solidity']}"
echo -e "    output to: ${SC_DOCS}\n"

echo "    Api service"
API_DOCS="${BASE_DOCS}/api"
mkdir -p $API_DOCS
./node_modules/.bin/jsdoc ./api/src -r -c ./.jsdoc-conf.json -d $API_DOCS
echo -e "    output to: ${API_DOCS}\n"

echo "    Deploy job"
DEP_DOCS="${BASE_DOCS}/deploy"
mkdir -p $DEP_DOCS
./node_modules/.bin/jsdoc ./deploy/src -r -c ./.jsdoc-conf.json -d $DEP_DOCS
echo -e "    output to: ${DEP_DOCS}\n"

# echo "    Zkp service"
# ZKP_DOCS="${BASE_DOCS}/zkp-service"
# mkdir -p $ZKP_DOCS
# echo -e "    output to: ${ZKP_DOCS}\n"

# echo "    UI docs"
# UI_DOCS="${BASE_DOCS}/ui"
# mkdir -p $UI_DOCS
# echo -e "    output to: ${UI_DOCS}\n"

echo "    Messenger service api"
MS_DOCS="${BASE_DOCS}/messenger-api"
mkdir -p $MS_DOCS
apidoc -i messenger/src -o $MS_DOCS -c messenger
echo -e "    output to: ${MS_DOCS}\n"
