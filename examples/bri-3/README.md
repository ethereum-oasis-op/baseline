## Description

BRI-3 is a simple reference implemenation of the baseline standard, developed under [grant 85](https://github.com/eea-oasis/baseline-grants/issues/85).  


This reference implementation is being built from scratch and will contain a limited set of features. It will serve the following purposes:

 * Plug and play Baseline Reference Implementation that can cover a number of business use-cases in live environments

 * Basis for community adoption and participation of companies with real-life business cases in extending the protocol

 * Trying out the concepts from the standard in practice and producing feedback loops for standard improvements

 * Entry point for developers to get to know the protocol, and start contributing in iterative and atomic fashion

 * Basis for the Baseline SDK

 * Set an example of how to build an open-source project under the Baseline protocol in regard to transparency, community participation and collaboration

 * First vendor-agnostic implementation of the protocol.

## Prerequisites

[Docker] (https://docs.docker.com/engine/install/)

[Node LTS] (https://nodejs.org/en/)

## Installation

```bash
$ docker run --name postgres -e POSTGRES_PASSWORD=example -p 5432:5432 -d postgres # start a postgres container
$ create a .env file based on the .env.sample # provide a connection string for the db instance
$ npm install # install project dependencies
$ npm install -g prisma # install prisma globally
$ prisma generate # generate the prisma client 
$ npx prisma migrate dev # migrate the db to latest state
```

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

BRI-3 is tested on three levels. 

```bash
# Manual testing - Export of the up-to-date Postman collection that can be used is located here: ./test/bri.postman_collection.json

$ npm run start
$ fire away postman requests
```

```bash
# Unit testing - .spec files located next to the thing they are testing
$ npm run test
```

```bash
# e2e testing - .e2e.spec files located in ./test folder
$ comming soon
```

## Architecture

BRI-3 is written in Typescript.

Server framework used is [NestJs](https://nestjs.com/). 

Architectural pattern is CQRS, using the NestJs [CRQS Module](https://docs.nestjs.com/recipes/cqrs).

ORM used is [Prisma](https://www.prisma.io/).

## Contributions

Comming soon.
