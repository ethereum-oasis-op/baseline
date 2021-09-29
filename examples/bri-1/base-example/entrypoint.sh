#!/bin/sh
# Await here for all the containers in the way they should be brought up.
# cd /usr/src/app/wait-for-it && ./wait-for-it.sh -t 60 postgres:5432

cd  /usr/src/app/ \
    && apk --no-cache --virtual build-dependencies add git python make g++ \
    && apk add curl \
    && git config --global url."https://".insteadOf git:// \
    && npm install \
    && npm run tsc \
    && apk del build-dependencies \

exec "$@"