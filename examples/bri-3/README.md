## Description

BRI-3 is a simple reference implemenation of the baseline standard, developed under [grant 85](https://github.com/eea-oasis/baseline-grants/issues/85).  


This reference implementation is being built from scratch and will contain a limited set of features. It will serve the following purposes:

 * Plug and play Baseline Reference Implementation that can cover a number of business use-cases in live environments

 * Basis for community adoption and participation of companies with real-life business cases in extending the protocol

 * Trying out the concepts from the standard in practice and producing feedback loops for standard improvements

 * Entry point for developers to get to know the protocol, and start contributing in an iterative and atomic fashion

 * Basis for the Baseline SDK

 * Set an example of how to build an open-source project under the Baseline protocol in regard to transparency, community participation and collaboration

 * First vendor-agnostic implementation of the protocol.

## Prerequisites

[Docker] (https://docs.docker.com/engine/install/)

[Node LTS] (https://nodejs.org/en/)

## Installation

```bash
# DB

$ docker run --name postgres -e POSTGRES_PASSWORD=example -p 5432:5432 -d postgres # start a postgres container
$ create a .env file based on the .env.sample # provide a connection string for the db instance
$ npm install # install project dependencies
$ npm run prisma:generate # generate the prisma client 
$ npm run prisma:migrate:dev # migrate the db to latest state
$ npx prisma db seed # seed db

```

## Messaging

Relevant information can be found in ./docs/nats/nats-configuration.md

## Environment configuration

Can be found in ./env.sample. Explanation: 

```bash
DATABASE_URL="postgresql://postgres:example@localhost:5432/postgres" # DB connection string
GOERLI_RPC_URL="" # Any GOERLI RPC url i.e. "https://rpc.ankr.com/eth_goerli". This is used to resolve dids
GOERLI_SERVICE_DID="did:ethr:0x5:<bpi_operator_public_key>" # bpi_operator_public_key = public key of the bpi operator that represents the issuer of the JWT token
GOERLI_SERVICE_SIGNER_PRIVATE_KEY="<bpi_operator_private_key>" # bpi_operator_private_key = private key of the bpi operator that is used to sign the issued JWT token
SERVICE_URL="bri-3" # JWT token audience
BPI_NATS_SERVER_URL="localhost:4222" # URL of the local NATS server instance used by the BPI
BPI_NATS_SERVER_USER="bpi_operator"
BPI_NATS_SERVER_PASS="liftboiliftboiliftboiliftboi1"
BPI_ENCRYPTION_KEY_K_PARAM="yzkXp3vY_AZQ3YfLv9GMRTYkjUOpn9x18gPkoFvoUxQ" # Encryption key params used by the BPI for Bpi Messages encryption at rest
BPI_ENCRYPTION_KEY_KTY_PARAM="oct"
SNARKJS_CIRCUITS_PATH="zeroKnowledgeArtifacts/circuits/" # used to construct the path to the circuit artifacts for a specific workstep by following this convention:
# SNARKJS_CIRCUITS_PATH + <workstep_name_in_snake_case>/<workstep_name_in_snake_case> + suffix for the artifact. Artifact suffixes:
# Circuit proving key = '_circuit_final.zkey'
# Circuit verification key = '_circuit_verification_key.json'
# Compiled circuit = '_circuit.wasm'
VSM_CYCLE_PERIOD_IN_SECS=15 # How many seconds before each VSM cycle
VSM_CYCLE_TX_BATCH_SIZE=5 # How many transactions to execute in the single VSM  cycle
MERKLE_TREE_HASH_ALGH="sha256" # Hash algorithm used in creation of Merkle Tree
```

Relevant information on DID Auth can be found in ./docs/dids/did-authentication.md

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# Manual testing - Export of the up-to-date Postman collection that can be used is located here: ./test/bri.postman_collection.json

$ npm run start
```

```bash
# Unit testing - .spec files located next to the thing they are testing

$ npm run test

# Run single spec file
$ npm run test -- transactions.agent.spec.ts
```


```bash
# e2e testing - .e2e.spec files located in ./test folder
# before running the tests, make sure that the database is properly populated with the seed.ts command (explained above)
# and make sure that the .env file contains correct values for DID login to work (as explained in the .env.sample)

$ npm run test:e2e
```

## Architecture

BRI-3 is written in Typescript.

Server framework used is [NestJs](https://nestjs.com/). 

Architectural pattern is CQRS, using the NestJs [CRQS Module](https://docs.nestjs.com/recipes/cqrs).

ORM used is [Prisma](https://www.prisma.io/).

## Contributions

Comming soon.
