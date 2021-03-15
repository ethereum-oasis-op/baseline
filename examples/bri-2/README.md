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
- docker
- docker-compose
- node v12.16
- npm
## Setup and run

Install node modules and compile imported Solidity smart contracts.
Note: may need to run `contracts:compile` twice
```
npm install
npm run contracts:compile
```

Setup the backend services env's. The Env examples default to Ganache
```
cp ./commit-mgr/.env_example ./commit-mgr/.env
cp ./workflow-mgr/.env_example ./workflow-mgr/.env
```

Spin up backend services in docker

If you have an existing docker build, first run: `docker volume rm bri-2_alice-mongo`
```
docker-compose up -d
```

Run `dashboard` front-end

Note: be sure to use `node v12.16`
```
cd dashboard
npm install
npm run build
npm run dev
```

Navigate to `http://localhost:3000` on your web browser to view the `dashboard`.
