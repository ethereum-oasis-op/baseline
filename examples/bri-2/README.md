# bri-2

`bri-2` is the second "baseline reference implementation". The purpose of this project is to show a baseline stack using different services compared to `bri-1`, but this stack must still comply with the baseline standards and specificiations, therefore allowing interoperability with other baseline stacks. `bri-2` introduces the `commit-mgr` service to `baseline`. The `commit-mgr` acts as an extension to a web3 provider, which allows a variety of Ethereum clients to become "baseline compatible". 

> Note: `bri-2` is still a work in progress. Components such as a vault/key manager, messenger, and system of record integration need to be added to make it a complete reference implementation.

Here is a comparison of the reference implementations:

| Service Type | bri-1 | bri-2 |
| -------- | ----- | ----------- |
| Eth. client | `Nethermind` | `commit-mgr` + `mongo` + `ITX` |
| Key management |`Provide Vault` | TBD |
| Messenger | `NATS` | TBD |

## Proposed Architecture

![baseline-architecture](./docs/bri-2-stack.png)

# Requirements
- docker and docker-compose
- node / npm
- [metamask wallet](https://metamask.io/download.html)
- ether account with some funds - [get Goerli funds here](https://faucet.goerli.mudit.blog/)
- [Infura account id](https://infura.io/)
