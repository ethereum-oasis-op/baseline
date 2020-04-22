# Welcome to Baseline

<div align="center">
  <img src="docs/assets/baseline-logo/Web/examples/PNGs/horizontal/baselineHorizontal-Logo-FullColor.png" />
  <p>
    Combining advances in cryptography, messaging, and blockchain to execute
    <br/>
    secure and private business processes via the public Ethereum Mainnet.
  </p>
  Read the full documentation <a href="https://docs.baseline-protocol.org">here at docs.baseline-protocol.org</a>.
  <p>
    <em>Join our <a href="https://communityinviter.com/apps/ethereum-baseline/join-us">Slack workspace</a> for Baseline news and updates!</em>
  </p>
  <br/>
</div>

__Baseline__ is an open source initiative with a large and growing team of supporting companies. The first code was donated by Ernst & Young and ConsenSys, with support from Microsoft, and is now receiving contributions from many other companies. The purpose of the project is to bring enterprises and complex business processes to the Ethereum Mainnet, while guarding the privacy constraints and needs of a typical group of enterprises.

The __Baseline Protocol__ defines a series of steps to privately and securely synchronize data and business logic between multiple independent systems of record, using the Ethereum Mainnet as an auditable common frame of reference. This protocol implements best practices around data consistency and compartmentalization, and leverages public Ethereum for verifying execution of private transactions, contracts and tokens on the Mainnet using ZKP (zkSnarks). The __Baseline Protocol__ is designed such that it can be extended and applied to any database/workflow.

# Radish34 Demo

In order to demonstrate the __Baseline Protocol__, we needed a use-case. The use-case chosen was product procurement within a supply-chain, and the custom application built for this workflow is called __Radish34__. This application was built as a proof of concept for the Baseline Protocol.

The __Baseline Protocol__ code is currently embedded inside the `/radish-api` directory, but we are in the process of moving that code into the `/baseline` directory to clearly distinguish the protocol from the use-case. Once this move is complete, `radish-api` will import `baseline` as a module, which will be the same process that other projects will need to follow to implement __Baseline__.

## Quickstart

A `Makefile` has been included for convenience; most of its targets wrap `npm`, `docker` and `solc` invocations.

Just want to get the __Baseline Protocol__ running locally? The following sequence will build the monorepo, start the __Baseline Protocol__ stack locally, deploy contracts and run the full test suite. *Note: this typically takes at least 20 minutes to complete.

```
make && make start && make test
```

### The demo UI

After running the above (`make test` optional) you can view the Radish34 demo by opening [http://localhost:3000](http://localhost:3000) in your browser.

Here are the targets currently exposed by the `Makefile`:

| Target | Description |
|:-------------|:------------------------------------------------------------|
| `make` | Alias for `make build`. |
| `make build` | Build all modules within the monorepo. |
| `make build-containers` | Dockerize all modules within the monorepo. |
| `make clean` | Reclaim disk used by all modules (i.e. `node_modules/`) and the local docker environment. This effectively uninstalls your local __Baseline__ environment and will require building from scratch. |
| `make contracts` | Compile the Solidity contracts. |
| `make deploy-contracts` | Deploy the Solidity contracts. Requires the stack to be running. |
| `make npm-install` | `npm i` wrapper for all modules in the monorepo. |
| `make start` | Start the full __Baseline__ stack. Requires `docker` service to be running with at least 12 GB RAM allocation. |
| `make stop` | Stop the running __Baseline__ stack. |
| `make system-check` | Verify that `docker` is configured properly. |
| `make restart` | Stop and start the `docker` stack. |
| `make reset` | Clean the docker environment by pruning the docker networks and volumes. |
| `make test` | Run the full test suite. Requires the stack to be running. |
| `make zk-circuits` | Perform zk-SNARK trusted setups for circuits contained within `zkp/circuits` |

## Running Radish34

To run the __Radish34__ application, follow the instructions in [radish34/README.md](radish34/README.md).

`cd radish34` and go from there 🚀

## Run Splunk integrated version

The steps are similar to the Quickstart guide above, but instead run the commands below.

Make sure you check out the [prerequisites to running the radish34 demo](https://github.com/splunk/baseline/blob/master/radish34/README.md#prerequisites-to-run-the-demo). Step 3 is not optional, you will need to complete that step to run the [Splunk Connect for Ethereum](https://github.com/splunk/splunk-connect-for-ethereum/) application that will parse transaction event data associated with the baseline contracts.

After start tasks complete, go to: http://splunk.docker:18000/en-US/app/search/baseline_status
Log in with user `admin` and password [`changeme`](https://github.com/splunk/baseline/blob/integrate-splunk/radish34/docker-compose-splunk.yml#L11)

### macOS

To start:
```
make
make start-splunk
```

To stop and reset:
```
make stop-ethlogger
make stop-splunk
make reset-splunk
```

### Ubuntu

If you're on linux (only tested on Ubuntu 18), you have to run the commands directly. Make sure you have node.js v11 installed. If your docker users aren't set up and you need to use `sudo` to interact with docker (this is already added below), make sure you take that into account when running the commands below.

Install dependencies

```
sudo apt-get install g++ build-essential
```

To make:
```
cd radish34
npm ci && \
npm run postinstall && \
sudo npm run build:contracts

sudo docker-compose build && \
sudo npm run setup
```

To start:
```
sudo docker-compose -f docker-compose-splunk.yml up -d && \
echo "Patiently waiting 75 seconds for splunk container to init ..." && \
sleep 75 && \
sudo npm run deploy && \
sudo docker-compose -f docker-compose-with-splunk.yml up -d && \
sudo docker-compose -f docker-compose-ethlogger.yml up -d
```

To stop and reset:
(from the radish34 directory)
```
docker-compose -f docker-compose-ethlogger.yml down
docker-compose -f docker-compose-splunk.yml down
docker-compose -f docker-compose-with-splunk.yml down && \
docker container prune -f && \
docker volume rm radish34_mongo-buyer radish34_mongo-supplier1 radish34_mongo-supplier2 radish34_mongo-merkle-tree-volume radish34_chaindata && \
rm splunk/checkpoints.json
```

#### Troubleshooting

##### Error starting dotdocker
When starting `dotdocker`, if you get the following error, here's how you can resolve it.
```
Error starting userland proxy: listen tcp 0.0.0.0:53: bind: address already in use
```
run:
```
sudo systemctl stop systemd-resolved
sudo systemctl disable systemd-resolved
```

##### Error logging into the github docker repo
When logging into the github docker repository, if you get the following error, here's how to resolve it.
```
Error saving credentials: error storing credentials - err: exit status 1, out: `Error calling StartServiceByName for org.freedesktop.secrets: Timeout was reached`
```
run:
```
sudo apt-get install gnupg2 pass
```

##### No blocks/peer connections after starting environment

After starting the environment, if you see in the [baseline dashboard in splunk](http://splunk.docker:18000/en-US/app/search/baseline_status) that the node peer connections are 0 and you're not getting new blocks, scroll to the bottom of the dashboard and copy/paste the commands in your terminal. That will tell the nodes to connect to each other.

# What is here?

The root directory of this repo (where this Readme currently lives) contains the following folders:

```
.
├── baseline  <-- Future home to the Baseline Protocol libraries
├── bin <-- Scripts to run across the entire project
├── docs <-- auto-generated and artisanal hand crafted documentation
└── radish34 <-- The demonstration POC (you probably are looking for this)
```

## Running scripts across the project

To use the top level scripts (currently just documentation auto-generation and collection) do the following:

Required: NodeJS 11.15 (nvm is recommended)

 - run `make npm-install` to install the top level packages

optionally `make clean` to clean out any `node_modules` folders installed by the `make npm-install` command.

# How to contribute?

See [our contributing guidelines](CONTRIBUTING.md)

# License

All code in this repo is released under the CC0 1.0 Universal public domain dedication. For the full license text, refer to [license.md](license.md).
