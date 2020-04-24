# Radish34

__Radish34__ is a product procurement application that utilizes the __Baseline Protocol__ to gain unprecedented data integrity while maintaining privacy and security for its users.

Disclaimer: This implementation is a demo, and production aspects of key management, wallet management, cloud hosting, integration to other third party tools and performance optimization are left out of scope to drive adoption and present a base set of tools for the community to provide inputs and take this further.

## Prerequisites to run the demo

1. Install [Docker for Mac](https://www.docker.com/docker-mac), or
    [Docker for Windows](https://www.docker.com/docker-windows)  
    - It's recommended that you allocate 12GB of RAM in Docker (see 'Troubleshooting').

2. (Optional) In order to use [Timber](https://github.com/EYBlockchain/timber), you will need to be logged into the Github package registry. To do this, you will need to [generate a Github Personal Access Token](https://help.github.com/en/github/authenticating-to-github/creating-a-personal-access-token-for-the-command-line). Make sure that the token you generate has at minimum `read: packages` and `repo` permissions.

After you've done that, log in to the Github package registry by running

`docker login -u <your-username> -p <the-token-you-just-generated> docker.pkg.github.com`

## Development/Test Environment

### Prerequisites/Assumptions

1. MacOS development environment (Catalina or later - 10.15.X). Note: It is possible it works in other environments/versions of MacOS
1. NodeJS version 11.15 installed (or use of NVM is recommended)
1. You are able to run the demo (☝️ see prerequisites above ☝️)

### Setup

The steps below illustrate the individual steps, that can be viewed as the breakdown of the `make` scripts.

1. As part of the development environment, we assume a procurement use-case with three users: (1) buyer and (2) supplier organizations.
2. Run `make npm-install` at the root level of the repo. ** This takes about 6 minutes to clean install npm packages in root and all sub directories **
3. Run `cd radish34/ && docker-compose build` to create the latest versions of the docker containers. ** Only do this the first time or when service source code is changed **. ** This takes about 40 minutes for a fresh build **
4. Run `cd radish34/ && npm run setup-circuits` to perform zk-SNARK trusted setups for the circuits that are contained in the `/zkp/circuits`. ** This takes about 5-10 minutes to complete ** 
    <details> 
      <summary>Example logs</summary>
      <p> 

      ```
      *** Starting zokrates container ***
      radish-34_radish-zkp-watch_1 is up-to-date
      mongo-buyer is up-to-date
      radish-34_radish-zkp_1 is up-to-date

      *** Running setup for createMSA ***
      {"verificationKey":{"H":[["0x28cbb3929742ba7f874746fb890540017813ef404ae38c7073bf030be3577194","0x0974c59917efe8f2aa0049ded97d3103a300ca864c122b1d4c13197d2548c550"],["0x205078b5f99a3e041d75a8d3eb0cafe24da9649271275861bafbfa074a946f68","0x23c46a91322035df6f503929d00efc95ab970633c0b9cdd521f26831137ce398"]],"Galpha":["0x030cb162dc5bb2112b625de1cff121dc0e867068f496d3862d8d27e144c13c64","0x143e8abb0bcdb24417a01bc581bff336c2539f9b48c39c5b1447a5e4ca8a79c6"],"Hbeta":[["0x2e1a7b77ee31735d5b8dd25a032ea8bfda27c5905bec6d3ee3d0b01169ed7961","0x149b8fb268d495e15e642da2bd172791fd65bf9cdc49da8f1b16c34635ede869"],["0x2ccd66691257c87cdbd98efad37a0f60422a1e4d73dd2c18ebd87fc8522db9be","0x15437cb448e5bf0cf3067e2de941cf4ed73f6f732dac9cf19f0e89555f6d7a36"]],"Ggamma":["0x0c132ee8e18b7dd37a7332f6138d2c30826910652de0df3d188fe3597da2208d","0x2cced0ec0c467fac9b6774739b696d2fd1074cdef99da52c986838cea132bbe8"],"Hgamma":[["0x060ae04d4f50d8f01ca4fad8a29fd6d0d8f6eae762c1345bbebab3d8ca8cd993","0x0bb22b3de71c381a8bbd3b40633f3c2db119b75f5874a28bf4f221bae4fa9d73"],["0x13aa539b007374ee850da69ee1b91869ca4d64337a41e2cf4eaef844a28c251c","0x299c36c9cc3aab3c7df10bff199bb66c6d954dfa4ba30b5b33705a4b5bf0708e"]],"query":[["0x2ea45bf055ff829b0348d5c2b0619371de5835c0e28dd63c3d806aa06e3890f5","0x2aa391d2cb16b76693d1dfbbe0272861e38e7cf457f38d0f93d5a7751f3fa7a0"],["0x18c4fa762ba68bdaabb02658ad113cc22333107d73ebc0f508e4c4f2f5a3aaf2","0x075062f8a367e48fc22c99752a8e0211148462c8dab0c87d4c12c85545594e07"]]}}
      *** Running setup for createPO ***
      {"verificationKey":{"H":[["0x2d5f6d4b7d13b5cebd8d6cece9dbce5ecb04d3ea80217e0426c2b1d72c2d972d","0x02ff4a4667c3fead0b270277aba0fef1a8f2e94e85b160d19385c089ac7cf501"],["0x25ddb0f3266fc2b2efefa6247f24355a327353f6ccfb5ca9fb5ab1352370a21b","0x1c078f4b5447ef774133731e301b43a9c8657123409333efffa74486a86fb47f"]],"Galpha":["0x0d36fc5d69ce3f50ec40bb9d3540fb1d898a2f91d48932bf55cfcb304af635e3","0x1a555461b3ac218af5fca356d75b9d0eecce6bb8d44aab275141e1a980077a67"],"Hbeta":[["0x29a47d9266d3a915ba517cd2d099ef4872c568d86d69c63ff5fa55aa7a5f6284","0x1125edf840c07eda41a962f71f1e0d8b4c0052587c6b6918ebb3a267c43b6255"],["0x2d15aefb7f2a3374e28671f5b4b5dc1db80660656b16fd81953a6104a95b61ef","0x2e43d6f090a7402b948824568e69a956646a8ddc79eba4bfad65da4863663ce5"]],"Ggamma":["0x11cf0010dc05657a0933a3366efab90a055ef76c926af3c94cd79df0daace624","0x138c005e154787838b851afc869be363e089b2e3786c197c1a7a7f8023e2adcf"],"Hgamma":[["0x267470583b8333a4c8b81331d12d6badfd49c416810fd23006ec393f812c8a56","0x14321eed994c76846d2b8b532e7995d3cb76c022ab05af426a99e98a53076779"],["0x0cfcd3abdf0119481374bf209c71f7afcd8920b85de0e95294933ddd3c16c92a","0x23871104deb8a7c03efaf1ede048dd9f968b4602ea7f824a5c8d4aaa1e6f4143"]],"query":[["0x1a7251f3ac3930802d03eae0f4d8187a62bcf752b33cedd98defe74ddc07cd8f","0x06a13bbc659fae79a8e0ab7fa474d4ae451d42633116e42e17334ee21a847fc5"],["0x26620d77c65980fb18256ee17bc0e80adc30ddb4c54cd61154432d713889ea33","0x237af6ad935a45192f8a279e3543bca9b04aa547d16501c3c164c9ef38ad59c0"]]}}
      *** Setups complete ***
      ``` 
      </p>
    </details> 

5. Run `cd radish34/ && npm run build:contracts` to compile the smart contracts in `contracts/contracts` to JSON files (containing ABI and Bytecode key value pairs) in the `contracts/artifacts` folder needed for deployment. ** This takes less than 15 seconds to run **
6. Run `cd radish34/ && npm run deploy` to deploy the smart contracts. ** This takes about 2 minutes **
    - This docker container first deploys both the Registry contract and the OrgRegistry contract.
    - Then it registers (1) Buyer and (2) Supplier organizations. The corresponding `/config/config-${role}.json` files are updated with the newly deployed contract addresses.
    - The goal of deployment is to initialize the Radish34 system by pre-registering a buyer and 2 suppliers with an `OrgRegistry` smart contract, which holds the organization metadata to thus enable any ongoing procurement operations.
    - Essentially the deployment is based on deploying an `ERC1820Registry` client called the `Registrar`, followed by registering an interface for `OrgRegistry` with the `ERC1820Registry`, then registering the roles of the buyer and supplier with the `OrgRegistry`
    - In addition, the contracts that are necessary for privacy management, `Shield` and `Verifier` contract are deployed to the network
    - Any changes to the config files are updated in the individual db instances `mongo-${role}`
    <details> 
      <summary>Example logs</summary>
      <p> 

      ```
      Patiently waiting 10 seconds for ganache container to init ...
      Checking for ganache ...
      ✅  ERC1820Registry deployed: 0x8CFd85A850E7fB9B37Ba2849012d2689AB293522
      ✅  OrgRegistry deployed: 0xe5806E14ac6a9411cb655cA91AC5a7d5ECc95862
      ✅  Verifier deployed: 0x39C3bACe46E6c7Be09d99A153eF43eC847D206c2
      ✅  Shield deployed: 0xE5a69331D7ba036cAAe587Ad610299e0e45F3309
      ℹ️   Registering workgroup member: buyer
      ✅  Registered buyer in the OrgRegistry with transaction hash: 0x6af81492ef5228f6e166b84e22697c667be15f94a001683ec6d61608c47bf6c5
      ✅  Registered OrgRegistry as IOrgRegistry for buyer with transaction hash: 0x3cd5c5c0e9a1346ac21de4f702b1fb6f87eb4ecdc0da0a5491baa4d6bc8e5f6a
      ✅  Registered Verifier as IVerifier for buyer with transaction hash: 0x1009e3ee6b081ee080e64c8ea08e2cae71ad9359b28314918152a678d91715a1
      ✅  Registered Shield as IShield for buyer with transaction hash: 0x8b672ca878482791275a2180a0c679ae984bdfa2ef84fcd9282023f7f79eb66d
      ℹ️   Registering workgroup member: supplier1
      ✅  Registered supplier1 in the OrgRegistry with transaction hash: 0x562ed3fe5c8822d4525c6fd6aa866b81b965953781064d3fe946add78b3061aa
      ✅  Registered OrgRegistry as IOrgRegistry for supplier1 with transaction hash: 0x08b97a912d4011392cf00f1a4adde4f4b56395290a9d2e33c0e22c639cbc2108
      ✅  Registered Verifier as IVerifier for supplier1 with transaction hash: 0x844aee6e13e0ec128f6c408a41e49c7f6d141945cc20cb2bcf54e021c38b0282
      ✅  Registered Shield as IShield for supplier1 with transaction hash: 0x7bdcb116d10ed41dd143cb065f780ee1fc154b08bdb46897403e4b4a2e371173
      ℹ️   Registering workgroup member: supplier2
      ✅  Registered supplier2 in the OrgRegistry with transaction hash: 0xec3a6cbe4f8f42cc6d5a6bb89a1413d5784bfbda9818b7dda67b778d86a449ae
      ✅  Registered OrgRegistry as IOrgRegistry for supplier2 with transaction hash: 0xf2231be5abc5f39e4dc254a8ece5e9bc6866d9ca4dedef187da5c046e29f487e
      ✅  Registered Verifier as IVerifier for supplier2 with transaction hash: 0xf9a836ad9e5c5c0e1134812812c735cef73fbe7b694010b7ebc95847abd1d247
      ✅  Registered Shield as IShield for supplier2 with transaction hash: 0x855ccb81c39698ef453ec10419182323b308fc364bdf49f18f28bf1d01ce7836
      ✅  Registered the Radish34 interface in the OrgRegistry with transaction hash: 0x29c7c0e8b145fb63fdfc1d8a3dc76cead21ab65ae6f1cf69aa5bdc8420614716
      ℹ️   Registering zkp verification keys
      ✅  Registered verification key for createMSA with transaction hash: 0xa391e86ebd7d3767755e5dfc605f9977e38b556261b519816c971c0fccee0b57
      ✅  Registered verification key for createPO with transaction hash: 0x8ed5166cedf673ced7fa16d75fa05911e2d1947ca99ee170301a223211b8d267
      ℹ️   Network information:
      ✅  Radish network of 3 organizations have successfully been set up!
      ✅  Information about buyer: 
      Organisation Address: 0xB5630a5a119b0EAb4471F5f2d3632e996bf95d41
      Organisation Name: Org1
      Organisation Role: 1
      Organisation MessagingKey: 0x04b6e809d37d1e8544e1ff4b26cdb4476b36a59a412e7870fccae994880245401f38fd971cee0c1c1c7eb6a02a5fbe976b7a7fde6088bd1b35129f17a805e256d9
      Organisation zkpPublicKey: 0x21864a8a3f24dad163d716f77823dd849043481c7ae683a592a02080e20c1965
      ✅  Information about supplier1: 
      Organisation Address: 0x5ACcdCCE3E60BD98Af2dc48aaf9D1E35E7EC8B5f
      Organisation Name: Supplier 1
      Organisation Role: 2
      Organisation MessagingKey: 0x04fdd6b03524fe9116f274d25bc85c523e138281a2156bdbdfeab34dd214c09d9496ef7b4ed3d4a160124dc89f48df4b174cf8ac7de5de778f933a0afb65f0b213
      Organisation zkpPublicKey: 0x1513500b81d1cc3ecb32c0a3af17756b99e23f6edff51fcd5b4b4793ea2d0387
      ✅  Information about supplier2: 
      Organisation Address: 0x3f7eB8a7d140366423e9551e9532F4bf1A304C65
      Organisation Name: Supplier 2
      Organisation Role: 2
      Organisation MessagingKey: 0x04caa2fda8e260d1d1d6c482979c931414e9ecfd8c7d1b452bb0b5a7703571e81b21eb85809a842af0adcfbf5f2f951352109fcee7a243dbe418c17d63fb9c990d
      Organisation zkpPublicKey: 0x03366face983056ea73ff840eee1d8786cf72b0e14a8e44bac13e178ac3cebd5
      ℹ️   Saving settings to config file for: buyer
      Updated settings in file /app/src/config/config-buyer.json
      ✅  Saved information about buyer: {"rpcProvider":"http://ganache:8545","organization":{"messengerKey":"0x04b6e809d37d1e8544e1ff4b26cdb4476b36a59a412e7870fccae994880245401f38fd971cee0c1c1c7eb6a02a5fbe976b7a7fde6088bd1b35129f17a805e256d9","name":"Org1","role":1,"zkpPublicKey":"0x21864a8a3f24dad163d716f77823dd849043481c7ae683a592a02080e20c1965","zkpPrivateKey":"0x29ae268c4e58726d63fb5b0dae75e8d70f77519d12063f1a8fa9ebec085e533d"},"addresses":{"ERC1820Registry":"0x8CFd85A850E7fB9B37Ba2849012d2689AB293522","OrgRegistry":"0xe5806E14ac6a9411cb655cA91AC5a7d5ECc95862","Verifier":"0x39C3bACe46E6c7Be09d99A153eF43eC847D206c2","Shield":"0xE5a69331D7ba036cAAe587Ad610299e0e45F3309"}}
      ℹ️   Saving settings to config file for: supplier1
      Updated settings in file /app/src/config/config-supplier1.json
      ✅  Saved information about supplier1: {"rpcProvider":"http://ganache:8545","organization":{"messengerKey":"0x04fdd6b03524fe9116f274d25bc85c523e138281a2156bdbdfeab34dd214c09d9496ef7b4ed3d4a160124dc89f48df4b174cf8ac7de5de778f933a0afb65f0b213","name":"Supplier 1","role":2,"zkpPublicKey":"0x1513500b81d1cc3ecb32c0a3af17756b99e23f6edff51fcd5b4b4793ea2d0387","zkpPrivateKey":"0xb084bd09eea9612b5790a73d9f88bdf644d56194a410b08f6d2ae09d5fccbfe"},"addresses":{"ERC1820Registry":"0x8CFd85A850E7fB9B37Ba2849012d2689AB293522","OrgRegistry":"0xe5806E14ac6a9411cb655cA91AC5a7d5ECc95862","Verifier":"0x39C3bACe46E6c7Be09d99A153eF43eC847D206c2","Shield":"0xE5a69331D7ba036cAAe587Ad610299e0e45F3309"}}
      ℹ️   Saving settings to config file for: supplier2
      Updated settings in file /app/src/config/config-supplier2.json
      ✅  Saved information about supplier2: {"rpcProvider":"http://ganache:8545","organization":{"messengerKey":"0x04caa2fda8e260d1d1d6c482979c931414e9ecfd8c7d1b452bb0b5a7703571e81b21eb85809a842af0adcfbf5f2f951352109fcee7a243dbe418c17d63fb9c990d","name":"Supplier 2","role":2,"zkpPublicKey":"0x03366face983056ea73ff840eee1d8786cf72b0e14a8e44bac13e178ac3cebd5","zkpPrivateKey":"0x111bc1d832ba0ea6804f031c6f0ec9550f4d2b55666c30d7b4cf532b22a45f25"},"addresses":{"ERC1820Registry":"0x8CFd85A850E7fB9B37Ba2849012d2689AB293522","OrgRegistry":"0xe5806E14ac6a9411cb655cA91AC5a7d5ECc95862","Verifier":"0x39C3bACe46E6c7Be09d99A153eF43eC847D206c2","Shield":"0xE5a69331D7ba036cAAe587Ad610299e0e45F3309"}}
      ----------------- Completed  -----------------
      Please restart the radish-apis for the config to take effect
      ```
      </p>
    </details> 

7. Run `cd radish34/ && docker-compose up -d && docker-compose restart`
   - This will reinstate and restart all `radish` containers
   - Wait about 10 seconds to give containers time to complete their initialization routines
   - Run `docker-compose logs -f {SERVICE_NAME}` to check the logs of specific containers. Key ones to watch are api-{role} and ui. For example: `docker-compose logs -f api-buyer api-supplier1 api-supplier2 ui`
    <details> 
      <summary>Example api-buyer logs</summary>
      <p> 

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
      </p>
    </details> 

8. Run integration tests: `cd radish34/ && npm run test`. ** This takes about 3-5 minutes to run to completion **
    <details> 
      <summary>Example logs</summary>
      <p> 

      ```
      > NODE_ENV=test jest --verbose --runInBand --forceExit
        
        console.log __tests__/integration.test.js:487
          Waiting for new MSA commitment in Shield contract. This can take up to 5 minutes...

        console.log __tests__/integration.test.js:490
          Checking for non-null MSA index, attempt: 0

        console.log __tests__/integration.test.js:490
          Checking for non-null MSA index, attempt: 1

        console.log __tests__/integration.test.js:490
          Checking for non-null MSA index, attempt: 2

        console.log __tests__/integration.test.js:490
          Checking for non-null MSA index, attempt: 3

        console.log __tests__/integration.test.js:495
          ...MSA commitment test complete.

        console.log __tests__/integration.test.js:527
          Buyer creating new PO for Supplier2. This test takes a few minutes...

      PASS  __tests__/integration.test.js (154.892s)
        Get organization settings from config files
          ✓ Buyer config retrieved (2ms)
          ✓ Supplier1 config retrieved (1ms)
          ✓ Supplier2 config retrieved
        Check that containers are ready
          Buyer containers
            ✓ Buyer messenger GET /health returns 200 (28ms)
            ✓ Buyer radish-api REST server GET /health returns 200 (19ms)
          Supplier1 containers
            ✓ Supplier1 messenger GET /health returns 200 (7ms)
            ✓ Supplier1 radish-api REST server GET /health returns 200 (21ms)
          Supplier2 containers
            ✓ Supplier2 messenger GET /health returns 200 (5ms)
            ✓ Supplier2 radish-api REST server GET /health returns 200 (15ms)
        Buyer sends new RFP to both suppliers
          Retrieve identities from messenger
            ✓ Buyer messenger GET /identities (7ms)
            ✓ Supplier2 messenger GET /identities (7ms)
          Create new RFP through buyer radish-api
            ✓ Buyer graphql mutation createRFP() returns 400 withOUT sku (75ms)
            ✓ Buyer graphql mutation createRFP() returns 200 (101ms)
          Check RFP existence through radish-api queries
            ✓ Buyer graphql query rfp() returns 200 (32ms)
            ✓ Supplier1 graphql query rfp() returns 200 (2115ms)
            ✓ Supplier2 graphql query rfp() returns 200 (106ms)
          Check that RFP creation messages exists in messenger databases
            ✓ Buyer messenger has raw message that delivered RFP to supplier1 (29ms)
            ✓ Buyer messenger has raw message that delivered RFP to supplier2 (17ms)
            ✓ Supplier1 messenger has raw message that delivered RFP from buyer (9ms)
            ✓ Supplier2 messenger has raw message that delivered RFP from buyer (8ms)
        Supplier2 sends new Proposal to buyer
          Create new Proposal through supplier2 radish-api
            ✓ Supplier2 graphql mutation createProposal() returns 200 (43ms)
          Check Proposal existence through radish-api queries
            ✓ Supplier2 graphql query proposal() returns 200 (23ms)
            ✓ Buyer graphql query proposal() returns 200 (3062ms)
        Buyer creates MSA, signs it, sends to Supplier2, Supplier2 responds with signed MSA
          Buyer creates new MSA for Supplier2 through radish-api
            ✓ Buyer graphql mutation createMSA() returns 400 without sku (16ms)
            ✓ Buyer graphql mutation createMSA() returns 200 (411ms)
            ✓ After a while, the commitment index should not be null (60153ms)
        Buyer creates PO for Supplier2 based on MSA
          Create new PO through buyer radish-api
            ✓ Buyer graphql mutation createPO() returns 400 without volume (12ms)
            ✓ Buyer graphql mutation createPO() returns 200 (86207ms)

      Test Suites: 1 passed, 1 total
      Tests:       28 passed, 28 total
      Snapshots:   0 total
      Time:        154.941s
      Ran all test suites.
      ```
      </p>
    </details> 

9. Within about 5 minutes, UI is loaded on `http://localhost:3000` on your local browser

## Collection of Log Commands

`docker-compose logs -f ui`  
`docker-compose logs -f api-buyer`  
`docker-compose logs -f messenger-buyer`   
`docker-compose logs -f mongo-buyer`  
`docker-compose logs -f api-supplier1`  
`docker-compose logs -f messenger-supplier1`  
`docker-compose logs -f mongo-supplier1`   
`docker-compose logs -f api-supplier2`  
`docker-compose logs -f messenger-supplier2`  
`docker-compose logs -f mongo-supplier2`  
`docker-compose logs -f geth-node`   
`docker-compose logs -f geth-miner1`  
`docker-compose logs -f geth-miner2`  
`docker-compose logs -f geth-bootnode`  

## Troubleshooting

1. If you get errors during the `npm i` step, please ensure that you are running node version `11`. The `nvm` (node version manager) tool allows you to easily switch between versions:
```
nvm install 11
nvm use 11
```

2. Restart the test environment
   - Run `docker-compose down` to stop containers
   - Run this command to give the docker command a clean slate: `docker volume prune -f && echo volume pruned && docker system prune -f && echo system pruned && docker network prune -f && echo network pruned`
   - In some cases, due to stale images application may have build issues owing to existing images and packages that were a part of those builds. To get around such issues, run `docker-compose build --no-cache` to run a clean re-build of the docker images
   - Run through the 'steps to start the application' in __Development/Test Environment__
3. Increasing resource allocation for Docker
   - During set up, `npm run setup-circuits`, there are cases where the setup instruction might fail, and the logs of the `zkp` container (`docker-compose logs -f zkp`) throws babel compilation errors. This is due to the memory consumption needed for running the compute intensive set up process. In these cases, it is recommended to toggle memory and CPU cores consumption
   - Consider these steps if you are running many of the `radish` containers and your PC is bogged down
   - Check the memory usage by running `docker stats`
   - If the containers are using most of the RAM allocated to Docker, you can increase RAM available to Docker by clicking the Docker Desktop icon in the task bar. Choose `Preferences --> Advanced`, then increase `Memory` to a recommended `12.0GiB` (default is `2.0GiB`). Although not required in all cases, it is recommended to increase the swap memory to 4GB and CPU cores to 8 on Docker Preferences/Settings.
4. Running tests
   - In some cases, while running the test suite `npm run test` there could be a socket hang up error. This is potentially due to race conditions across the different containers for the API services. To resolve this issue run `docker-compose restart api-buyer api-supplier1 api-supplier2` to get rid of errors while running the test suite.

1. Check health of the containers. Running `docker ps` will show all the containers for the Radish34 demo and if they are healthy or not. To inspect the health check results of a container run the following `docker inspect --format='{{json .State.Health}}' your-container-name`

### Front-end Environment

1. When the above setup is run successfully, the UI is ready at `http://localhost:3000`
2. Typically, this process takes about a minute to two. Successful loading of UI at the url can be inspected based on the logs of the `ui` container.
    <details> 
      <summary>Example logs</summary>
      <p> 

      ```
      ui_1           | > @ start /app
      ui_1           | > react-scripts start
      ui_1           |
      ui_1           |
      ui_1           | Starting the development server...
      ui_1           |
      ui_1           | Compiled successfully!
      ui_1           |
      ui_1           | You can now view undefined in the browser.
      ui_1           |
      ui_1           |   Local:            http://localhost:3000/
      ui_1           |   On Your Network:  http://172.27.0.14:3000/
      ui_1           |
      ui_1           | Note that the development build is not optimized.
      ui_1           | To create a production build, use npm run build.
      ```
      </p>
    </details> 
