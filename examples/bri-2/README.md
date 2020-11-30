# bri-2

`bri-2` is the second "baseline reference implementation". The purpose of this project is to show a baseline stack using different services compared to `bri-1`, but this stack must still comply with the baseline standards and specificiations. `bri-2` introduces the `commit-mgr` service to `baseline`. The `commit-mgr` acts as an extension to a web3 provider, which allows a variety of Ethereum clients to become "baseline compatible". 

Here is a comparison of the reference implementations:

| Service Type | bri-1 | bri-2 |
| -------- | ----- | ----------- |
| Eth. client | `Nethermind` | `commit-mgr` + `mongo` + `Besu` |
| Key managment |`Provide Vault` | TBD |
| Messenger | `NATS` | TBD |

## Proposed Architecture

The purple blocks in the following diagram have been built. The green blocks are proposed services to be added and interact with the exisiting services.

![baseline-architecture](./docs/bri-2-stack.png)
