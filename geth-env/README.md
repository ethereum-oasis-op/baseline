# Local Ethereum Network
***Forked from https://github.com/javahippie/geth-dev.***

Run the following command to start up a local private Ethereum network using docker containers for the geth nodes.
```
docker-compose up
```
If you edit any of the dockerfiles, start the network with the following command to ensure that the containers pickup your changes.
```
docker-compose up --build
```

==========

***The following instructions are from https://github.com/javahippie/geth-dev and may not apply to Radish34 efforts. Preserving these instructions just in case there is useful setup information.***

A set of Docker images to create a local Ethereum network with three nodes and a monitor. This was built to understand how local Ethereum networks have to be set up and to provide a local test environment. **Never use this in a productive environment, as the docker-compose.yml contains hardcoded passwords and private keys for convenience**

The testnet consists out of multiple parts :
* 1 Bootnode - registers existing nodes on the network, discovery service.
* 2 Miners - Also called **sealers** with proof-of-authority. They validate the blocks. No RPC is exposed as they are required to be unlocked.
* 1 Node - This serves as **transaction relay** and is a fullnode that does not mine, is locked but has RPC exposed
* 2 Swarm nodes - These nodes make up the **peer-to-peer CDN**
* 1 Blockchain explorer - Lightweight web application to explore the blockchain through web application. 

## Usage
Setting up this networks requires you to install Docker. Clone the repository, and run `docker-compose up` from the repository root. The network should start and synchronize without any further configuration. The networks always uses the latest available versions of Ethereum and Swarm, the network is set up for clique proof-of-authority similar to the Ethereum Rinkeby testnet. For more information on clique POA see https://github.com/ethereum/EIPs/issues/225 .

## The bootnode
The nodes in the network are connecting with the bootnode. This is a special ethereum node, designed to provide a register of the existing nodes in the network. The parameter `nodekeyhex`in the `docker-compose.yml` is needed to derive the `enodeID` which is later passed to the other nodes. The IP needs to be fixed, as the other nodes need to know where to find the bootnode, and DNS is not supported. The bootnode does not participate in synchronization of state or mining.

## Miners / Geth Nodes
There are three nodes that participate in the network. The state is synchronized between them and they are trying to create blocks with mining. Initially they connect to the bootnode with the information derived from the fixed IP and the nodekeyhex. If you want to interact with the network, you need to connect via RPC. You can attach a geth instance, connect Remix IDE or connect your browser with web3 and build a ÐApp.

The RPC Ports of the nodes are mapped to your localhost, the addresses are:

* geth-dev-miner-1 : No RPC exposed
* geth-dev-miner-2: No RPC exposed
* geth-dev-node: [http://localhost:8545](http://localhost:8545)

## Swarm (/BZZ:/)
Swarm is a distributed storage platform and content distribution service, a native base layer service of the ethereum web3 stack. The primary objective of Swarm is to provide a sufficiently decentralized and redundant store of Ethereum’s public record, in particular to store and distribute dapp code and data as well as blockchain data. From an economic point of view, it allows participants to efficiently pool their storage and bandwidth resources in order to provide these services to all participants of the network, all while being incentivised by Ethereum. Files on Swarm are represented by their KECCAK256 Checksum.

The RPC Ports of the nodes are mapped to your localhost, the addresses are:

* [http://localhost:8500](http://localhost:8500) - geth-swarm-1
* [http://localhost:8501](http://localhost:8501) - geth-swarm-2

## Whisper (/SHH:/)
Coming soon ...

## Blockchain Explorer
The blockchain explorer is a simple node.js web application being provided by a seperate container: geth-explorer. The application uses the web3 javascript API to fetch the data from `geth-dev-node` through RPC calls. The blockchain explorer can be found at [http://localhost:8080](http://localhost:8080).
