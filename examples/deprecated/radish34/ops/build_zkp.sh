#!/bin/bash

pushd zkp
git diff --exit-code --quiet HEAD ./package.json
if [ $? -ne 0 ] || [[ ! -d ./node_modules ]]
then
  npm ci
fi
popd
