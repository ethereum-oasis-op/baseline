# radish-34

Note that, the license is under an MoU signed between EY, MSFT and ConsenSys. No parties are to disseminate or share information unless it is agreed upon by the members of this repo.

## Prerequisites

1.  Install [Docker for Mac](https://www.docker.com/docker-mac), or
    [Docker for Windows](https://www.docker.com/docker-windows)

2.  Install and start [dotdocker](https://github.com/aj-may/dotdocker)

    `dotdocker start`

## Development/Test Environment

1. run `npm run deploy`
   - This docker container first deploys both the Registry contract and the OrgRegistry contract.
   - Then it registers a Buyer and 3 Supplier organizations. The corresponding `/config/config-${role}.json` files are updated with the newly deployed contract addresses.
2. run `docker-compose up`
   - Alternatively, run this command to only start the subset of containers needed for integration tests: `docker-compose up sol-compile jest ganache radish34-ui radish-deploy radish-api-buyer radish-api-supplier1 radish-api-watch mongo-buyer mongo-seed geth-bootnode geth-miner-1 geth-node messenger-buyer messenger-supplier1`
   - Wait about 10 seconds to give containers time to complete their initialization routines
3. run `npm run test` to run integration tests

## Troubleshooting

1. Restart the test environment
   - run `docker-compose down` to stop containers
   - run this command to give the docker command a clean slate: `docker volume prune -f && echo volume pruned && docker system prune -f && echo system pruned && docker network prune -f && echo network pruned`
   - run through the steps in __Development/Test Environment__

### Front-end development


## API

Endpoints are currently RESTful API endpoints. Future plans to convert them to graphQL are currently in progress. Data is randomly generated based on a simple schema for each of the following routes:

[Partner](http://radish-api.docker/partner)
[SKU](http://radish-api.docker/sku)
[RFQ](http://radish-api.docker/rfq)

## Development DB

Run `npm run seed` to generate/replace and populate the mongo db with the test data located in `./mongo-seed/collections`
