# Local Ethereum Network

This directory contains the code needed to run a local, private Ethereum network. This network is used as the messaging layer to send messages between Radish34 users via the Whisper protocol within geth nodes. The repo's root-level `docker-compose.yml` uses this code to deploy the following types of containers. 
> Warning: Do not use this setup in a production environment. The docker-compose.yml contains hardcoded Ethereum account passwords and private keys.

1. **bootnode**: need (1) of these to register nodes on the network and connect them to peers
2. **miner**: need at least (2) of these running in order to produce new blocks in our local, private PoA (proof-of-authority) network
3. **node**: each user/organization needs (1) of these containers, which is a full-node used as the Whisper client for the `messenger` service

## Bootnode
The nodes in this network connect with the bootnode. This is a special Ethereum node that provides a register of the existing nodes in the network. The parameter `nodekeyhex` in the `docker-compose.yml` is needed to derive the `enodeID`, which is later passed to the other nodes. The IP needs to be fixed, as the other nodes need to know where to find the bootnode, and DNS is not currently supported. The bootnode does not participate in synchronization of state or mining.

## Miners / Geth Nodes
The blockchain state is synchronized between these nodes. Initially the nodes connect to the bootnode with the information derived from the fixed IP and the `nodekeyhex`. Harpo uses websockets to connect to the client `nodes` and execute Whisper RPCs.
