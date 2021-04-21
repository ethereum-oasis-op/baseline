# bri-2

`bri-2` is the second "baseline reference implementation". The purpose of this project is to show a baseline stack using different services compared to `bri-1`, but this stack must still comply with the baseline standards and specificiations, therefore allowing interoperability with other baseline stacks. `bri-2` introduces the `commit-mgr` service to `baseline`. The `commit-mgr` acts as an extension to a web3 provider, which allows a variety of Ethereum clients to become "baseline compatible". 

> Note: `bri-2` is still a work in progress. Components such as a vault/key manager, messenger, and system of record integration need to be added to make it a complete reference implementation.

# Requirements
- docker
- docker-compose
- node v12.16
- npm

# Quickstart

```
make build
make start
```

## Run `dashboard` front-end

Note: be sure to use `node v12.16`
```
cd dashboard
npm install
npm run build
npm run dev
```

Navigate to `http://localhost:3000` on your web browser to view the `dashboard`.

# Troubleshooting

- If you have an existing bri-2 build, run the following sequence to remove old build artifacts:
```
make clean
make build
make start
```
- You may need to run `make build` twice in order to properly compile smart contracts
- Note: Environment variables default to use Ganache as the Ethereum network

# Architecture

Here is a comparison of the reference implementations:

| Service Type | bri-1 | bri-2 |
| -------- | ----- | ----------- |
| Eth. client | `Nethermind` | `commit-mgr` + `mongo` + `ITX` |
| Key management |`Provide Vault` | `Codefi Orchestrate` |
| P2P Messenger | `NATS` | `NATS` |

![baseline-architecture](./docs/bri-2-stack.png)
