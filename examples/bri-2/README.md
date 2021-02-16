![Baseline Logo](./dashboard/assets/img/baselineHorizontal-Logo-Full-Color.svg)

# bri-2

`bri-2` is the second "baseline reference implementation". The purpose of this project is to show a baseline stack using different services compared to `bri-1`, but this stack must still comply with the baseline standards and specificiations, therefore allowing interoperability with other baseline stacks. `bri-2` introduces the `commit-mgr` service to `baseline`. The `commit-mgr` acts as an extension to a web3 provider, which allows a variety of Ethereum clients to become "baseline compatible". 

> Note: `bri-2` is still a work in progress. Components such as a vault/key manager, messenger, and system of record integration need to be added to make it a complete reference implementation.

Here is a comparison of the reference implementations:

| Service Type | bri-1 | bri-2 |
| -------- | ----- | ----------- |
| Eth. client | `Nethermind` | `commit-mgr` + `mongo` + `ITX` |
| Key managment |`Provide Vault` | TBD |
| Messenger | `NATS` | TBD |

## Proposed Architecture

The purple/orange blocks in the following diagram have been built. The green blocks are proposed services to be added and interact with the exisiting services.

![baseline-architecture](./docs/bri-2-stack.png)


# Baseline Chain Dashboard(bri-2)

# Requirements
- docker and docker-compose
- node / npm
- yarn
- [metamask wallet](https://metamask.io/download.html)
- ether account with some funds - [get Goerli faucets here](https://faucet.goerli.mudit.blog/)
- [a infura account id](https://infura.io/)

# Usage and installation

### 1. Clone Repo

```sh
git clone https://github.com/ethereum-oasis/baseline.git
```

### 2. Install packages and dependencies + Build

```sh
cd baseline/examples/bri-2
```

```sh
npm run build:all
```
[![Install packages and dependencies](https://asciinema.org/a/391633.svg)](https://asciinema.org/a/391633)

### 3. Run development enviroment

```sh
npm run start:dev
```
[![Run development enviroment](https://asciinema.org/a/391634.svg)](https://asciinema.org/a/391634)

### Or production enviroment

*Install pm2*
```sh
npm install -g pm2
```

*You will need rebuild the dashboard if you started the development enviroment previously*
```sh
npm run build:dashboard
```

```sh
npm run start:prod
```
[![Run production enviroment](https://asciinema.org/a/391640.svg)](https://asciinema.org/a/391640)


# 4. Setup and Settings

- Open [http://localhost:3000](http://localhost:3000) in your browser
- Login using your metamask wallet account
- Go Settings -> fill "infura id" and wallet private key fields -> Save

>*Switch network feature only fully works under production enviroment*

![Save settings](./docs/save-settings.jpg)

# Video Demo

[![Baseline Dashboard Demo](https://img.youtube.com/vi/wIyu6ptO0Q0/maxresdefault.jpg)](https://youtu.be/wIyu6ptO0Q0)


# Screenshots

![Login Page](./docs/baseline_dashboard_login.jpg)

![Dashboard](./docs/baseline_dashboard_1.jpg)

![Dashboard](./docs/baseline_dashboard_2.jpg)

![Dashboard](./docs/baseline_dashboard_3.jpg)

![Switch Network](./docs/baseline_dashboard_switch_network.jpg)

![Baseline DID Generator](./docs/baseline_didgenerator.jpg)

![Baseline Basic Phonebook](./docs/baseline_phonebook.jpg)

![Commit-mgr Settings](./docs/baseline_dashboard_settings.jpg)


# Contracts [GOERLI TEST NET]

[Shield.sol - 0x63758bc241d4cd924ebfbed273a2f6a1179f8f86](https://goerli.etherscan.io/address/0x63758bc241d4cd924ebfbed273a2f6a1179f8f86)

[VerifierNoop.sol - 0x76f272ba2b1c3887f117dfeeb600e53b50a2207b](https://goerli.etherscan.io/address/0x76f272ba2b1c3887f117dfeeb600e53b50a2207b)


# Change Log

## Alpha Release [0.1.0] 2021-01-28
[X] started project Baseline Chain Switcher Demo and Components

[X] added UI Dashboard

## [0.1.1] 2021-01-29
[X] added commit-mgr service tests report to dashboard

[X] commit-mgr should be configurable via env vars such that it can use Infura as its web3 provider

[ ] a repeatable test suite should be written to ensure baseline transactions can be submitted through Infura

[X] Shield.sol and Verifier.sol contracts should be deployed on a public testnet/mainnet (verifiable via etherscan or similar)

[ ] root/leaves of on-chain merkle-tree in Shield contract should match root/leaves of off-chain tree stored in mongo

[X] commitments made in private Besu network should be replicated on public testnet/mainnet

### Bonus features:
[X] add Well-Known DID configuration generator

[X] add simple Baseline Phonebook UI

[ ] use a faucet account or another way to fund public testnet/mainnet transactions so that judges can easily run test suite.

[ ] find a way to securely+efficiently move what has already gone to the private Besu chain instance and move that to the public ethereum mainnet before commencing with new transactions.

[ ] the verification circuit enforces some business logic (instead of using a no-op circuit)

[X] add a UI that allows the user to configure the commit-mgr service

## Alpha Release [0.1.3] 2021-02-10
[X] commit-mgr updated

[X] dashboard UI moved to ./bri-2 folder

[X] DID service moved to ./bri-2 folder

[X] Unit tests added