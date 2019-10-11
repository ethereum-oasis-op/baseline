# radish-34

Note that, the license is under an MoU signed between EY, MSFT and ConsenSys. No parties are to disseminate or share information unless it is agreed upon by the members of this repo.

## Prerequisites

1.  Install [Docker for Mac](https://www.docker.com/docker-mac), or
    [Docker for Windows](https://www.docker.com/docker-windows)

1.  Install and start [dotdocker](https://github.com/aj-may/dotdocker)

    `dotdocker start`

## Development/Test Environment
In order to run local environments for testing and developing within the Radish34 repo, there is a scripts folder. Depending on your needs, you can choose a script or a combination of scripts to run a subset of containers instead of running `docker-compose up`, which starts all containers and therefore uses significant processing power.

### Front-end development
Run the following commands from the repo root directory. This will start several docker containers including `radish-ui`, `radish-api`, and `mongo`. It purposefully excludes all `geth` node containers.
```
cd scripts
./frontend.sh
```

## API

Endpoints are currently RESTful API endpoints. Future plans to convert them to graphQL are currently in progress. Data is randomly generated based on a simple schema for each of the following routes:

[Partner](http://radish-api.docker/partner)
[SKU](http://radish-api.docker/sku)
[RFQ](http://radish-api.docker/rfq)

## Development DB

Run `npm run seed` to generate/replace and populate the mongo db with the test data located in `./mongo-seed/collections`
