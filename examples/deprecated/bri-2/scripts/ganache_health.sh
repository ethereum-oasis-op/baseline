#!/bin/sh

wget -q --spider --post-data='{"jsonrpc":"2.0","method":"health-check","params":[],"id":67}' \
  --header='Content-Type:application/json' \
  'http://localhost:8545'
