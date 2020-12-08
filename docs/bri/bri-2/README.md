# bri-2

`bri-2` is the second "baseline reference implementation". The purpose of this project is to show a baseline stack using different services compared to `bri-1`, but this stack must still comply with the baseline standards and specificiations, therefore allowing interoperability with other baseline stacks. `bri-2` introduces the `commit-mgr` service to `baseline`. The `commit-mgr` acts as an extension to a web3 provider, which allows a variety of Ethereum clients to become "baseline compatible". 

> Note: `bri-2` is still a work in progress. Components such as a vault/key manager, messenger, and system of record integration need to be added to make it a complete reference implementation.

Here is a comparison of the reference implementations:

| Service Type | bri-1 | bri-2 |
| -------- | ----- | ----------- |
| Eth. client | `Nethermind` | `commit-mgr` + `mongo` + `ITX` |
| Key managment |`Provide Vault` | TBD |
| Messenger | `NATS` | TBD |

## Commitment Manager

The commitment manager service acts as an extension to an existing web3 provider (Infura, Besu, etc.) by providing an RPC server that processes baseline methods and relays all others to the web3 provider. The baseline methods are responsible for managing merkle-trees both on-chain in Shield smart contracts and off-chain in a mongo database. The off-chain version is a full tree while the on-chain version is a partial tree containing the minimal "frontier" nodes needed to re-calculate the merkle root when new leaves are added. The "frontier" design and much of the code for hashing merkle nodes is taken from EY Blockchain's [Timber service](https://github.com/EYBlockchain/timber). Commitment manager has configurations and test suite that currently run against the following Ethereum clients (configurable through a .env file):
- ganache
- besu (private network)
- Infura (traditional api)
- Infura Managed Transactions (ITX) - gas service

An especially notable integration is the [ITX service](https://infura.io/docs/transactions) because it removes the requirement for the baseline user to ever own real ETH when using the mainnet. Instead, users can allow Infura to pay for the transaction cost (gas), then pay Infura with traditional fiat payments.

## Proposed Architecture

The purple/orange blocks in the following diagram have been built. The green blocks are proposed services to be added and interact with the exisiting services.

![baseline-architecture](../../assets/bri-2/bri-2-stack.png)
