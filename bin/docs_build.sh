#!/bin/bash

echo "Generating docs..."

echo "    Smart contracts"
SC_DOCS='./docs/generated/contracts'
if [ -d "$SC_DOCS" ]; then rm -Rf $SC_DOCS; fi
mkdir -p $SC_DOCS
npx solidity-docgen -i ./contracts -o $SC_DOCS --contract-pages --solc-settings "{remappings: ['openzeppelin-solidity=$PWD/node_modules/openzeppelin-solidity']}"
echo "    output to: ${SC_DOCS}"
