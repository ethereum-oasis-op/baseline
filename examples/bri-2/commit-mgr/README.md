# Commitment Manager

The commitment manager service acts as an extension to an existing web3 provider (Infura, Besu, etc.) by providing an RPC server that processes baseline methods and relays all others to the web3 provider. The baseline methods are responsible for managing merkle-trees both on-chain in Shield smart contracts and off-chain in a mongo database. The off-chain version is a full tree while the on-chain version is a partial tree containing the minimal "frontier" nodes needed to re-calculate the merkle root when new leaves are added. The "frontier" design and much of the code for hashing merkle nodes is taken from EY Blockchain's [Timber service](https://github.com/EYBlockchain/timber).

## Details

- Node 12
- Typescript
- Express based REST+jsonrpc server
- TSLinting
- Jest testing framework

## Initial Setup

- `cp .env_example .env` - create an initial `.env` file that holds env variables used by `baseline-relay` service
- `npm install` - install node module dependencies
- `cd .. && npm install` - install root-level node.js modules
- `npm run contracts:compile` - compile Solidity contracts and copy results into `contracts/artifacts/`

Before running, decide which blockchain environment you would like to use. Supported options are:
- `ganache`
- `besu`
- `infura`
- `infura-gas`

Then, set the following environment variables in `commit-mgr/.env` file to correctly configure the `commit-mgr` service: 
- `ETH_CLIENT_TYPE`
- `ETH_CLIENT_HTTP`
- `ETH_CLIENT_WS`
- `WALLET_PRIVATE_KEY` (redefine if not using ganache/besu private networks)
- `WALLET_PUBLIC_KEY` (redefine if not using ganache/besu private networks)
- `CHAIN_ID` (redefine if not using ganache/besu private networks)

## Run

- `npm run up:besu` OR `npm run up:ganache` OR `npm run up:infura` - spin up complementary containers/services
- `npm run dev` - run the baseline-relay as a local node process
- `npm test` - run jest test suite against baseline-relay

## Baseline JSON-RPC Module

The `commit-mgr` service implements and processes the baseline JSON-RPC methods:

| Method | Params | Description |
| -------- | ----- | ----------- |
| `baseline_getCommit` | address, commitIndex | Retrieve a single commit from a tree at the given shield contract address |
| `baseline_getCommits` | address, startIndex, count | Retrieve multiple commits from a tree at the given shield contract address |
| `baseline_getRoot` | address | Retrieve the root of a tree at the given shield contract address |
| `baseline_getProof` | address, commitIndex | Retrieve the membership proof for the given commit index |
| `baseline_getTracked` | | Retrieve a list of the shield contract addresses being tracked and persisted |
| `baseline_verifyAndPush` | sender, address, proof, publicInputs, commit | Inserts a single commit in a tree for a given shield contract address |
| `baseline_track` | address | Initialize a merkle tree database for the given shield contract address |
| `baseline_untrack` | address, prune? | Remove event listeners for a given shield contract address |
| `baseline_verify` | address, value, proof | Verify a proof for a given root and commit value |

## TODO

- Convert all javascript files to typescript
