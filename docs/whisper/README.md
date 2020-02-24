# Overview

This module contains test results from testing the Whisper messaging protocol. These files are not used for running Radish/Baseline, but are preserved for reference.

# Tests

## Phase One

In order to run the tests described in `/tests/results/phase_1.md`, run the following commands. Within the file `/config/nodes.json`, edit the `whisper_test_params` settings to try different delays between messages and total number of messages sent per test run. Save the file after editing then rerun `npm run test`.

```
docker-compose -f ../geth-env/docker-compose.yml up --build geth-bootnode geth-dev-miner-1 geth-dev-miner-2 geth-node-light-1 geth-node-light-2
npm run test
```

## Phase Two

In order to run the tests described in `/tests/results/phase_2.md` you need three nodes connected to the Ethereum mainnet. Run two light clients locally, and setup a full node in AWS or your favorite cloud provider. The reason to use a cloud provider is to limit the amount of processing that your local machine has to handle. You will also need to manually peer your light clients to your full node using the web3 RPC command `admin_addPeer`. After setup is complete, run the tests: `npm run test`

## Phase Three

In order to run the tests described in `/tests/results/phase_3.md` you need four nodes connected to the Ethereum mainnet. Again run two light clients locally, and setup two full nodes in AWS or your favorite cloud provider, one on the east coast and one on the west coast. You will need to manually peer each light client to one of your full nodes as shown in the network diagram in `/tests/results/phase_3.md`. After setup is complete, run the tests: `npm run test`
