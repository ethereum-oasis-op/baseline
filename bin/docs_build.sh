#!/bin/bash

echo "Generating docs..."
BASE_DOCS='./docs/generated'
if [ -d "$BASE_DOCS" ]; then rm -Rf $BASE_DOCS; fi

echo "    Smart contracts"
SC_DOCS="${BASE_DOCS}/contracts"
mkdir -p $SC_DOCS
npx solidity-docgen -i ./contracts -o $SC_DOCS --contract-pages --solc-settings "{remappings: ['openzeppelin-solidity=$PWD/node_modules/openzeppelin-solidity']}"
echo -e "    output to: ${SC_DOCS}\n"

echo "    Radish-api service"
API_DOCS="${BASE_DOCS}/radish-api"
mkdir -p $API_DOCS
./node_modules/.bin/jsdoc ./radish-api/src -r -c ./.jsdoc-conf.json -d $API_DOCS
echo -e "    output to: ${API_DOCS}\n"

echo "    Radish-deploy "
DEP_DOCS="${BASE_DOCS}/radish-deploy"
mkdir -p $DEP_DOCS
./node_modules/.bin/jsdoc ./radish-deploy/src -r -c ./.jsdoc-conf.json -d $DEP_DOCS
echo -e "    output to: ${DEP_DOCS}\n"

# echo "    Zok service"
# ZOK_DOCS="${BASE_DOCS}/zok-service"
# mkdir -p $ZOK_DOCS
# echo -e "    output to: ${ZOK_DOCS}\n"

# echo "    UI docs"
# UI_DOCS="${BASE_DOCS}/ui"
# mkdir -p $UI_DOCS
# echo -e "    output to: ${UI_DOCS}\n"

# echo "    Messenger service"
# MS_DOCS="${BASE_DOCS}/messenger"
# mkdir -p $MS_DOCS
# echo -e "    output to: ${MS_DOCS}\n"
