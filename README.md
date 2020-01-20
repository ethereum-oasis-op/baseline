# radish-34

Note that, the license is under an MoU signed between EY, MSFT and ConsenSys. No parties are to disseminate or share information unless it is agreed upon by the members of this repo.

## Prerequisites

1.  Install [Docker for Mac](https://www.docker.com/docker-mac), or
    [Docker for Windows](https://www.docker.com/docker-windows)

2.  Install and start [dotdocker](https://github.com/aj-may/dotdocker)

    `dotdocker start`

## Development/Test Environment

1. run `npm run build` to create the JSON files in the `artifacts` folder needed for deployment.
2. Make sure you download and have available locally the config files: `config-buyer.json`, `config-supplier1.json`, `config-supplier2.json`.
3. run `npm run deploy`
   - This docker container first deploys both the Registry contract and the OrgRegistry contract.
   - Then it registers a Buyer and 3 Supplier organizations. The corresponding `/config/config-${role}.json` files are updated with the newly deployed contract addresses.
4. run `docker-compose up`
   - This will start all `radish` containers. Alternatively, run this command to save resources and only start the subset of containers needed for integration tests: `docker-compose up ganache radish-deploy radish-api-buyer radish-api-supplier1 radish-api-watch geth-bootnode geth-miner1 geth-miner2 geth-node messenger-buyer messenger-supplier1`
   - Wait about 10 seconds to give containers time to complete their initialization routines
5. run integration tests: `npm run test`

## Troubleshooting

1. Restart the test environment
   - run `docker-compose down` to stop containers
   - run this command to give the docker command a clean slate: `docker volume prune -f && echo volume pruned && docker system prune -f && echo system pruned && docker network prune -f && echo network pruned`
   - run through steps 3-5 in __Development/Test Environment__
2. Increase RAM allocated to Docker
   - Consider these steps if you are running many of the `radish` containers and your PC is bogged down
   - Check the memory usage by running `docker stats`
   - If the containers are using most of the RAM allocated to Docker, you can increase RAM available to Docker by clicking the Docker Desktop icon in the task bar. Choose `Preferences --> Advanced`, then increase `Memory` to `3.0GiB` or whatever value you want (default is `2.0GiB`).

### Front-end development

## API

User accessible endpoints are built as a graphQL API. Data is randomly generated based on a simple schema for each of the following routes:

[Partner](http://radish-api.docker/partner)
[SKU](http://radish-api.docker/sku)
[RFQ](http://radish-api.docker/rfq)

## Development DB

Run `npm run seed` to generate/replace and populate the mongo db with the test data located in `./mongo-seed/collections`
