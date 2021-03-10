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
## Setup and run

Install node modules and compile imported Solidity smart contracts.
```
npm install
npm run contracts:compile
```

Spin up helper containers
```
docker volume rm bri-2_alice-mongo
docker-compose up -d alice-mongo ganache
```

Setup `commit-mgr`
```
cd commit-mgr
npm install
cp .env_example .env
npm run dev
```

Setup `workflow-mgr`
```
cd workflow-mgr
npm install
cp .env_example .env
npm run dev
```

Run `dashboard`
```
cd dashboard
npm install
npm run build
npm run dev
```

Navigate to `http://localhost:3000` on your web browser to view the `dashboard`.
