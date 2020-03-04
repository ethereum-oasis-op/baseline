# Radish34

__Radish34__ is a product procurement application that utilizes the __Baseline Protocol__ to gain unprecedented data integrity while maintaining privacy and security for its users.

## Prerequisites

1.  Install [Docker for Mac](https://www.docker.com/docker-mac), or
    [Docker for Windows](https://www.docker.com/docker-windows)  
    - It's recommended that you allocate 12GB of RAM in Docker (see 'Troubleshooting').

1.  Install and start [dotdocker](https://github.com/aj-may/dotdocker)

    `dotdocker start`

1.  In order to use [Timber](https://github.com/EYBlockchain/timber), you will need to be logged into the Github package registry. To do this, you will need to [generate a Github Personal Access Token](https://help.github.com/en/github/authenticating-to-github/creating-a-personal-access-token-for-the-command-line). Make sure that the token you generate has at minimum `read: packages` and `repo` permissions.

After you've done that, log in to the Github package registry by running

`docker login -u <your-username> -p <the-token-you-just-generated> docker.pkg.github.com`

## Development/Test Environment

1. As part of the development environment, we assume a procurement use-case with three users: (1) buyer and (2) supplier organizations.
1. run `npm ci`
1. run `npm run setup` to perform zk-SNARK trusted setups for the main circuits.
1. run `npm run build` to create the JSON files in the `artifacts` folder needed for deployment.
1. Make sure you download and have the following files stored in your `/config` directory: `config-buyer.json`, `config-supplier1.json`, `config-supplier2.json`.
1. run `npm run deploy`
   - This docker container first deploys both the Registry contract and the OrgRegistry contract.
   - Then it registers a Buyer and 2 Supplier organizations. The corresponding `/config/config-${role}.json` files are updated with the newly deployed contract addresses.
   - The goal of deployment is to initialize the Radish34 system by pre-registering a buyer and 2 suppliers with an `OrgRegistry` smart contract, which holds the organization metadata to thus enable any ongoing procurement operations.
   - Essentially the deployment is based on deploying an `ERC1820Registry` client called the `Registrar`, followed by registering an interface for `OrgRegistry` with the `ERC1820Registry`, then registering the roles of the buyer and supplier with the `OrgRegistry`
   - Any changes to the config files are updated in the individual db instances `mongo-${role}`
   Example logs:
   ```
      > docker-compose run --rm radish-deploy sh deploy.sh
      Creating network "radish-34_network-buyer" with the default driver
      Creating network "radish-34_network-supplier1" with the default driver
      Creating network "radish-34_network-supplier2" with the default driver
      Creating network "radish-34_network-geth" with the default driver
      Creating volume "radish-34_mongo-buyer" with default driver
      Creating volume "radish-34_mongo-supplier1" with default driver
      Creating volume "radish-34_mongo-supplier2" with default driver
      Creating volume "radish-34_chaindata" with default driver
      Creating mongo-supplier1     ... done
      Creating mongo-supplier2     ... done
      Creating radish-34_ganache_1 ... done
      Creating mongo-buyer         ... done
      Creating geth-bootnode       ... done
      Creating geth-miner1         ... done
      Creating geth-node           ... done
      Creating messenger-supplier1 ... done
      Creating messenger-buyer     ... done
      Creating messenger-supplier2 ... done
      Patiently waiting 10 seconds for ganache container to init ...
      Checking for ganache ...
      ✅  Registry Deployed: 0x40364ff01aBCeb7E5D6BCB79121616f81930b4E0
      ✅  OrganizationRegistry Deployed: 0xC5d828f2110323Fa6EBb387173Fc4318c5bAc9fF
      ✅  Assigned the buyer as the manager: 0x0f296630f1c5dee2d683472b3250a04a0b3b6337cdd5395f99fc60195c51bebb
      ✅  Set OrgReg as Interface Implementer for buyer: 0x0e00f93f42360ef8457bffc232eb4e2271a9cd2dfc719bd9d365cba49adb947a
      ✅  Retrieved all Whisper Identity for each user
      ✅  Registered buyer in the OrgReg with tx hash: 0x0f080333d1df65841341940d440c1737cbeb820af1a77221c157904111bd3626
      ✅  Registered supplier1 in the OrgReg with tx hash: 0x896453881ca5b5289c03a140e6e30bc4f920fc9b3173c7b67eeef8337fd1ffd2
      ✅  Registered supplier2 in the OrgReg with tx hash: 0xaa9a8e2b5f9cbb95785b60b94734f53f90f38638917a291074f75f21686cc920
      ✅  getOrg: 3 Organizations have successfully been set up!
      {
      address: '0xB5630a5a119b0EAb4471F5f2d3632e996bf95d41',
      name: 'Org1',
      role: 1,
      messagingKey: '0x0453f6d033725be702e7e00a0056a62caa5c3700796899dbc69d2001a1dae1717b65d30ed3e7e607f8f00bfc69f09c0e22ef69fcee7cd6980434de34863c21491d'
      }
      {
      address: '0x5ACcdCCE3E60BD98Af2dc48aaf9D1E35E7EC8B5f',
      name: 'Supplier 1',
      role: 2,
      messagingKey: '0x044afa99241d27e98cc4121631dbdc04945d2f8dc242c0c143c20c6af37962b95e374b6e1181690e94c6b0aaaa7771b912fc4e7689ca9a415de08577943091c177'
      }
      {
      address: '0x3f7eB8a7d140366423e9551e9532F4bf1A304C65',
      name: 'Supplier 2',
      role: 2,
      messagingKey: '0x040fefefd141664daea6347f1960dc60fe25bb084cc807187d3a119a042d49f6a155222dbcd6fc17acc976757fb371fa60e37118f1572314d066655bc6f2e112eb'
      }
      Updated settings for buyer to include: {
      organizationRegistryAddress: '0xC5d828f2110323Fa6EBb387173Fc4318c5bAc9fF',
      globalRegistryAddress: '0x40364ff01aBCeb7E5D6BCB79121616f81930b4E0',
      organizationName: 'Org1',
      organizationRole: 1,
      organizationWhisperKey: '0x0453f6d033725be702e7e00a0056a62caa5c3700796899dbc69d2001a1dae1717b65d30ed3e7e607f8f00bfc69f09c0e22ef69fcee7cd6980434de34863c21491d'
      }
      Updated settings for supplier1 to include: {
      organizationRegistryAddress: '0xC5d828f2110323Fa6EBb387173Fc4318c5bAc9fF',
      globalRegistryAddress: '0x40364ff01aBCeb7E5D6BCB79121616f81930b4E0',
      organizationName: 'Supplier 1',
      organizationRole: 2,
      organizationWhisperKey: '0x044afa99241d27e98cc4121631dbdc04945d2f8dc242c0c143c20c6af37962b95e374b6e1181690e94c6b0aaaa7771b912fc4e7689ca9a415de08577943091c177'
      }
      Updated settings for supplier2 to include: {
      organizationRegistryAddress: '0xC5d828f2110323Fa6EBb387173Fc4318c5bAc9fF',
      globalRegistryAddress: '0x40364ff01aBCeb7E5D6BCB79121616f81930b4E0',
      organizationName: 'Supplier 2',
      organizationRole: 2,
      organizationWhisperKey: '0x040fefefd141664daea6347f1960dc60fe25bb084cc807187d3a119a042d49f6a155222dbcd6fc17acc976757fb371fa60e37118f1572314d066655bc6f2e112eb'
      }
      ----------------- Completed  -----------------
      Please restart the radish-apis for the config to take effect
   ```
1. run `docker-compose up`
   - This will start all `radish` containers. Alternatively, run the following command to save resources and only start the subset of containers needed for integration tests: `docker-compose up -d ganache radish-api-buyer radish-api-supplier1 radish-api-watch geth-node messenger-buyer messenger-supplier1 redis-buyer redis-supplier1 mongo-buyer mongo-supplier1`
   - Wait about 10 seconds to give containers time to complete their initialization routines
   - Run `docker-compose logs -f {SERVICE_NAME}` to check the logs of the containers. Key ones to watch are: `radish-api-{role}` and `radish34-ui`
   Example Logs:
   ```
      radish-api-buyer        | Connected to db
      radish-api-buyer        | Mongoose connected to db
      radish-api-buyer        | Loading config file ...
      radish-api-buyer        | 🚀 Internal REST-Express server listening at http://localhost:8101
      radish-api-buyer        | Loading network http://ganache:8545...
      radish-api-buyer        | Connected to network: { chainId: 333, name: 'unknown' }
      radish-api-buyer        | Whisper key: 0x0453f6d033725be702e7e00a0056a62caa5c3700796899dbc69d2001a1dae1717b65d30ed3e7e607f8f00bfc69f09c0e22ef69fcee7cd6980434de34863c21491d
      radish-api-buyer        | Loading wallet with address 0xB5630a5a119b0EAb4471F5f2d3632e996bf95d41
      radish-api-buyer        | Wallet balance: 999.89182446
      radish-api-buyer        | Your organization has already been registered with the registry
      radish-api-buyer        | All systems go.
      radish-api-buyer        | 🏥  Healthcheck Status: ready
      radish-api-buyer        | 🚀 Server ready at http://localhost:8001/graphql
      radish-api-buyer        | 🚀 Subscriptions ready at ws://localhost:8001/graphql`
   ```
1. run integration tests: `npm run test`
1. Wait a couple minutes, then you should be able to view the loaded UI on `http://radish34-ui.docker` on your local browser

## Troubleshooting

1. Restart the test environment
   - run `docker-compose down` to stop containers
   - run this command to give the docker command a clean slate: `docker volume prune -f && echo volume pruned && docker system prune -f && echo system pruned && docker network prune -f && echo network pruned`
   - run through the 'steps to start the application' in __Development/Test Environment__
1. Increase RAM allocated to Docker
   - Consider these steps if you are running many of the `radish` containers and your PC is bogged down
   - Check the memory usage by running `docker stats`
   - If the containers are using most of the RAM allocated to Docker, you can increase RAM available to Docker by clicking the Docker Desktop icon in the task bar. Choose `Preferences --> Advanced`, then increase `Memory` to a recommended `12.0GiB` (default is `2.0GiB`).

### Front-end Environment

1. When the above setup is run successfully, the UI is ready at `http://radish34-ui.docker`
2. Typically, this process takes about a minute to two. Successful loading of UI at the url can be inspected based on the logs of the `radish34-ui` container.
   Example Logs:
   ```
      radish34-ui_1           | > @ start /app
      radish34-ui_1           | > react-scripts start
      radish34-ui_1           |
      radish34-ui_1           |
      radish34-ui_1           | Starting the development server...
      radish34-ui_1           |
   ```
