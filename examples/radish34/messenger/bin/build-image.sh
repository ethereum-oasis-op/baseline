#!/bin/bash

BUILD_TAG='messenger:latest'
BUILD_FILE='messenger-latest.tar'
BUILD_PATH="build/${BUILD_FILE}"

mkdir -p 'build'

docker image build --rm --compress --tag $BUILD_TAG .
echo "Image Built and tagged ${BUILD_TAG}"

docker image save messenger:latest --output $BUILD_PATH 
chmod a+r $BUILD_PATH
echo "Image saved to ${BUILD_PATH}"
