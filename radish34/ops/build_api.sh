#!/bin/bash

pushd api && git diff --exit-code --quiet HEAD . && if [ $? -ne 0 ] || [[ ! -dir ./node_modules ]]; then npm ci; fi && popd
