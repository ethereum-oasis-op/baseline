#!/bin/bash

BUILD_TAG='commit-mgr:latest'
BUILD_FILE='commit-mgr-latest.tar'
BUILD_PATH="build/${BUILD_FILE}"

mkdir -p 'build'

docker image build --rm --compress --tag $BUILD_TAG ./commit-mgr
echo "Image Built and tagged ${BUILD_TAG}"

docker image save ${BUILD_TAG} --output $BUILD_PATH 
chmod a+r $BUILD_PATH
echo "Image saved to ${BUILD_PATH}"
