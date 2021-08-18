# bri-2

`bri-2` is the second "baseline reference implementation". The purpose of this project is to show a baseline stack using different services compared to `bri-1`, but this stack must still comply with the baseline standards and specificiations, therefore allowing interoperability with other baseline stacks. `bri-2` introduces the `commit-mgr` service to `baseline`. The `commit-mgr` acts as an extension to a web3 provider, which allows a variety of Ethereum clients to become "baseline compatible".

> **Note**: `bri-2` is still a work in progress. Components such as a vault/key manager and P2P messenger need to be added to make it a complete reference implementation.

# Requirements

- docker
- docker-compose
- node v12.16
- npm
- ConsenSys Quorum account (for `vault` + `key-manager` services)

> **Note**: Create a free ConsenSys Quorum trial account [here](https://accounts.quorum.consensys.net/auth/realms/quorum/account). Access the API documention for the `key-manager` service [here](https://consensys.github.io/orchestrate/#tag/Key-Manager).

# Quickstart

```
make build
make start
```

## Workflow creation

After the docker containers have successfully initialized, make the following request to `workflow-mgr` in order to create a new workflow.

```
POST http://localhost:5001/workflows?type=signature
{
   "description": "signature test",
   "clientType": "test client",
   "chainId": "101010",
   "identities": [
       "4bd3822517db41e55a9d234187b22215187d20ba37d83208ddc7788dc473f31e"
   ]
}
```

This request should initiate the following sequence of events. The sequencing of steps is accomplished by using NATS as a job queuing service. If successful, steps 1-8 will be completed and the workflow object will have a ZkCircuitId, Shield contract address, Verifier address, and a status of `success-track-shield`.

![workflow-setup](./docs/workflow-setup.png)

## Run `dashboard` front-end

In order to run interact with the `bri-2` stack through a browser, please run the following commands.

> Note: be sure to use `node v12.16`

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
  > Note: Environment variables default to use `ganache` as the Ethereum network

# Current Capabilities

- Create new workflows
- Automatically generate, compile, and run setup for zero-knowledge signature-checking circuit
- Automatically compile newly created Verifier Solidity smart contract
- Automatically deploy Shield and signature-checking Verifier smart contracts to `ganache`

# Future Capabilities

- Create new commitments (hashes of JSON objects) for the Workflows
- Push the commitments (hashes) into the on-chain merkle tree inside the Shield contract
- P2P messenger service for communicating commitment details to counterparties
- Integrated L2 to reduce mainnet gas fees
- Automated integration level test suite
- Codefi Orchestrate Key-Manager service integrated for Eth/EDDSA key storage and signing capabilities

# Architecture

Here is a comparison of the reference implementations:

| Service Type   | bri-1           | bri-2                |
| -------------- | --------------- | -------------------- |
| Eth. client    | `Nchain`        | `commit-mgr` + `ITX` |
| Key management | `Provide Vault` | `Codefi Orchestrate` |
| P2P Messenger  | `NATS`          | `NATS`               |

![baseline-architecture](./docs/bri-2-stack.png)

# Running From Windows 10
The text below describes what you will need todo if you are running the project from a Windows 10 machine. 

If running in windows you will need to install the wsl2 windows subsystem for linux. https://docs.microsoft.com/en-us/windows/wsl/install-win10 You will need to install Ubuntu 20.04 when prompted.

If you want, you can install the new windows terminal and use it for your linux commands. https://www.microsoft.com/en-us/p/windows-terminal/9n0dx20hk701?activetab=pivot:overviewtab


After installing Docker For Windows you will need to change docker to use the installed WSL2. https://docs.docker.com/desktop/windows/wsl/

From your windows terminal or bash shell you will need to run https://github.com/nodejs/node-gyp/issues/1207
* npm install -g npm
* npm install -g node-gyp make
See github repo for more info https://github.com/nodejs/node-gyp
This is to fix an error while running the make commands.

Install make in the linux subsystem using apt-get install make

VSCode is designed to be used with both the native operating system and the Windows linux subsystem. You will need to mount the linux system to the source code of this project. When you open VSCode in this projects directory, you can make changes to the files and have them working in the linux subsystem.  https://code.visualstudio.com/docs/remote/wsl

After installing all of these items you are ready to build and run the examples above. 

## Windows Troubleshooting
If you run into errors when running the shell scripts it might be because there are CTRL M characters, which is a common problem in converting between Unix and DOS. Run the command below on the files that are having issues to fix the problem. 

* sed -i -e 's/\r$//' NAME-OF-FILE.sh on all the script files