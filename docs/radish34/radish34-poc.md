---
description: 'After migration to /baseline, point this file to /radish34 readme.md'
---

# Radish34 POC

If you’ve read the [Radish34 Explained](radish34-explained.md) section or played with the [user experience demo](radish34-demo.md) and now want to build and run the POC yourself, you’re in the right place. Find the authoritative set-up documentation in the Github repo [here](https://github.com/ethereum-oasis/baseline/blob/master/radish34/README.md).

{% embed url="https://github.com/ethereum-oasis/baseline/blob/master/radish34/README.md" caption="Radish34 POC Official Build Readme" %}

Below is a copy we will keep updated for quick reference.

## Prerequisites

1. Install [Docker for Mac](https://www.docker.com/docker-mac), or [Docker for Windows](https://www.docker.com/docker-windows)
   * It's recommended that you allocate 12GB of RAM in Docker \(see 'Troubleshooting'\).
2. In order to use [Timber](https://github.com/EYBlockchain/timber), you will need to be logged into the Github package registry. To do this, you will need to [generate a Github Personal Access Token](https://help.github.com/en/github/authenticating-to-github/creating-a-personal-access-token-for-the-command-line). Make sure that the token you generate has at minimum `read: packages` and `repo` permissions.

After you've done that, log in to the Github package registry by running

`docker login -u <your-username> -p <the-token-you-just-generated> docker.pkg.github.com`

## Development/Test Environment

1. As part of the development environment, we assume a procurement use-case with three users: \(1\) buyer and \(2\) supplier organizations.
2. Run `npm i && npm run postinstall`. \*\* This takes about 6 minutes to clean install npm packages in root and all sub directories \*\*
3. Run `docker-compose build` to create the latest versions of the docker containers. \*\* Only do this the first time or when service source code is changed \*\*. \*\* This takes about 40 minutes for a fresh build \*\*
4. Run `npm run setup-circuits` to perform zk-SNARK trusted setups for the circuits that are contained in the `/zkp/circuits`. \*\* This takes about 5-10 minutes to complete \*\* Example logs:

\[ Need to fix the code segments below...maybe....at least it scrolls. \]

```text
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

1. Run `npm run build` to compile the smart contracts in `contracts` to JSON files \(containing ABI and Bytecode key value pairs\) in the `artifacts` folder needed for deployment. \*\* This takes less than 15 seconds to run \*\*
2. Make sure you download and have the following files stored in your `/config` directory: `config-buyer.json`, `config-supplier1.json`, `config-supplier2.json`.
3. Run `npm run deploy` to deploy the smart contracts. \*\* This takes about 2 minutes \*\*

   * This docker container first deploys both the Registry contract and the OrgRegistry contract.
   * Then it registers \(1\) Buyer and \(2\) Supplier organizations. The corresponding `/config/config-${role}.json` files are updated with the newly deployed contract addresses.
   * The goal of deployment is to initialize the Radish34 system by pre-registering a buyer and 2 suppliers with an `OrgRegistry` smart contract, which holds the organization metadata to thus enable any ongoing procurement operations.
   * Essentially the deployment is based on deploying an `ERC1820Registry` client called the `Registrar`, followed by registering an interface for `OrgRegistry` with the `ERC1820Registry`, then registering the roles of the buyer and supplier with the `OrgRegistry`
   * In addition, the contracts that are necessary for privacy management, `Shield` and `Verifier` contract are deployed to the network
   * Any changes to the config files are updated in the individual db instances `mongo-${role}` Example logs:

   ```text
      > docker-compose run --rm radish-deploy sh deploy.sh
      ✅  ERC1820Registry deployed:  0x448de9B34ac4DD0901DCc3f2fF1a31822B51a397
      ✅  OrgRegistry deployed:  0x31088fd0eede771d5bda1558e06a666Cd9BF110c
      ✅  BN256G2 library deployed:  0x8f17969A8dc9cbAe2EB98541F33c7c396f615241
      ✅  Verifier deployed:  0xDf3C747B74CeFe4ffEa5baa2D0eAFE2B0F86A8F3
      ✅  Shield deployed:  0x7370f1C710F3af6f28Be19ed99e0ed8f1B59b1CB
      ✅  Assigned the deployer as the manager for OrgRegistry. TxHash: 0x1689ac60fba5c25b5559e0fbca066c4063a433dec552adc9208977e161f05852
      ✅  Set OrgRegistry as Interface Implementer for deployer. TxHash: 0x52660020dad54f7177896e16ba9e6956aa4c046e59c2bf92b53db06d387802a2
      ✅  Retrieved all Whisper Identity for each user
      ✅  Registered buyer in the OrgRegistry with tx hash: 0x77e39fc3398e405caaf895a2ea29966423dc8f01f0bffdc335579d0865837415
      ✅  Registered supplier1 in the OrgRegistry with tx hash: 0xefc1142c39f95766d245eab0d7dc4fe0860fded16c4531d529e6636136888123
      ✅  Registered supplier2 in the OrgRegistry with tx hash: 0x354c5a0745690f5c68a33f481e8c89cdbd103b24e549839374f589dc1b15c49c
      ✅  getOrg: 3 Organizations have successfully been set up!
      {
      address: '0xB5630a5a119b0EAb4471F5f2d3632e996bf95d41',
      name: 'Org1',
      role: 1,
      messagingKey: '0x04660083ec950731f412cb96cca49f55d443c370ed8e2d3d938769ce4b200ffc0e9597001574b165b4030235331de26f49b1c4ea1c03d902d2ba75302393fa050e',
      zkpPublicKey: '0x21864a8a3f24dad163d716f77823dd849043481c7ae683a592a02080e20c1965'
      }
      {
      address: '0x5ACcdCCE3E60BD98Af2dc48aaf9D1E35E7EC8B5f',
      name: 'Supplier 1',
      role: 2,
      messagingKey: '0x047087e00ac5d68d752caab75c7107329f354a52a9e220d83a0bd14b9a76dbcc359a7e604548a48f0e9a45f5f0d9a31a2b9fa005ec5fd0cce49ccb229a6a28eaff',
      zkpPublicKey: '0x1513500b81d1cc3ecb32c0a3af17756b99e23f6edff51fcd5b4b4793ea2d0387'
      }
      {
      address: '0x3f7eB8a7d140366423e9551e9532F4bf1A304C65',
      name: 'Supplier 2',
      role: 2,
      messagingKey: '0x04fa022574ff337d4e5ab9e529a9dc379c8e12fb9fb424c7c400de9ba42d9e24d9d37fb6cd88c182f9908a1451765d98c561006df44a637b9b72551f9f43dc73a7',
      zkpPublicKey: '0x03366face983056ea73ff840eee1d8786cf72b0e14a8e44bac13e178ac3cebd5'
      }
      Updated settings for buyer to include: {
      addresses: {
         ERC1820Registry: '0x448de9B34ac4DD0901DCc3f2fF1a31822B51a397',
         OrgRegistry: '0x31088fd0eede771d5bda1558e06a666Cd9BF110c',
         BN256G2: '0x8f17969A8dc9cbAe2EB98541F33c7c396f615241',
         Verifier: '0xDf3C747B74CeFe4ffEa5baa2D0eAFE2B0F86A8F3',
         Shield: '0x7370f1C710F3af6f28Be19ed99e0ed8f1B59b1CB'
      },
      organization: {
         messengerKey: '0x04660083ec950731f412cb96cca49f55d443c370ed8e2d3d938769ce4b200ffc0e9597001574b165b4030235331de26f49b1c4ea1c03d902d2ba75302393fa050e',
         name: 'Org1',
         role: 1,
         zkpPublicKey: '0x21864a8a3f24dad163d716f77823dd849043481c7ae683a592a02080e20c1965',
         zkpPrivateKey: '0x29ae268c4e58726d63fb5b0dae75e8d70f77519d12063f1a8fa9ebec085e533d'
      }
      }
      Updated settings for supplier1 to include: {
      addresses: {
         ERC1820Registry: '0x448de9B34ac4DD0901DCc3f2fF1a31822B51a397',
         OrgRegistry: '0x31088fd0eede771d5bda1558e06a666Cd9BF110c',
         BN256G2: '0x8f17969A8dc9cbAe2EB98541F33c7c396f615241',
         Verifier: '0xDf3C747B74CeFe4ffEa5baa2D0eAFE2B0F86A8F3',
         Shield: '0x7370f1C710F3af6f28Be19ed99e0ed8f1B59b1CB'
      },
      organization: {
         messengerKey: '0x047087e00ac5d68d752caab75c7107329f354a52a9e220d83a0bd14b9a76dbcc359a7e604548a48f0e9a45f5f0d9a31a2b9fa005ec5fd0cce49ccb229a6a28eaff',
         name: 'Supplier 1',
         role: 2,
         zkpPublicKey: '0x1513500b81d1cc3ecb32c0a3af17756b99e23f6edff51fcd5b4b4793ea2d0387',
         zkpPrivateKey: '0xb084bd09eea9612b5790a73d9f88bdf644d56194a410b08f6d2ae09d5fccbfe'
      }
      }
      Updated settings for supplier2 to include: {
      addresses: {
         ERC1820Registry: '0x448de9B34ac4DD0901DCc3f2fF1a31822B51a397',
         OrgRegistry: '0x31088fd0eede771d5bda1558e06a666Cd9BF110c',
         BN256G2: '0x8f17969A8dc9cbAe2EB98541F33c7c396f615241',
         Verifier: '0xDf3C747B74CeFe4ffEa5baa2D0eAFE2B0F86A8F3',
         Shield: '0x7370f1C710F3af6f28Be19ed99e0ed8f1B59b1CB'
      },
      organization: {
         messengerKey: '0x04fa022574ff337d4e5ab9e529a9dc379c8e12fb9fb424c7c400de9ba42d9e24d9d37fb6cd88c182f9908a1451765d98c561006df44a637b9b72551f9f43dc73a7',
         name: 'Supplier 2',
         role: 2,
         zkpPublicKey: '0x03366face983056ea73ff840eee1d8786cf72b0e14a8e44bac13e178ac3cebd5',
         zkpPrivateKey: '0x111bc1d832ba0ea6804f031c6f0ec9550f4d2b55666c30d7b4cf532b22a45f25'
      }
      }

      Calling /vk(createMSA)

      Calling /vk(createPO)
      Registering vk 18452423262158563026882841675284148407764318157675563070471972217739237880212,4277133668186723831235654096540406807435824845570986335989907942141598418256,14616192035444969003150436321512501628878979352937787850238113590938741010280,16177987224694778648394767874211717524305731735983237888308452790599874831256,1379364984911720626136072585337712693683924249341665513273559476871662484580,9156758973430525230183885922794684348950481245148957809524672239190422485446,20853181206633468719848310853413619676027324855469494224326295594157686487393,9321110026344006065486305790542153704131355025977797475517112642918390032489,20264675796796795709830270740195303883800970394987912963744700332878435563966,9617809250603145165440088584290061628278893233855154595575290228291958307382,5461648036022214211143369568016219712491248347178880605917470283234837405837,20267177760088363139518624979647286695343598308760404799328244803079201012712,2733093637597886369210205749822745181805572745097005975696082802272958732691,5290238555934889435703756934523226089301002621758403523617432452706499992947,8894885147880399898314634619246753739957540450191160311306953007213291775260,18820833068779199149030979951558447374152704724892152325431094507233231270030,21096788491815322535016425843114301240063117688587680689790922945196138729717,19286142148252889888118610521758324658736978834444902653793263786010395781024,11203539013152302732163359604934774718305715328124835655309460996779078298354,3308220779682536962176390239229157209211243587623820368961890312836741680647 against txTypeEnumUint 0
      ✅  Uploaded verification key for createMSA. TxHash: 0x8967d201803467a818c332905d355050bdf7b698917276627d67823bbd2caa02
      Registering vk 20522682982920878954594520278759298871294760675964764796460214555440489273133,1355684326038743620561541607821672442687007980490919311671186212947595425025,17127269861568797267541709762677184095889927147335292037601863383053224682011,12678116670384323664497410100274034092546770156661828399087071137612145079423,5977218531577562924693023811035666278242250033114290451697255598040978699747,11910898444400756692554841800903798844456503196287448234655645015860119566951,18835456375812065002333445288481415807355768040920100504693284277397399495300,7756334174082466369268236005053638756106862232385752031594640362579538174549,20392389658810310087927513615796829306670593413799627867169141543694610686447,20926253247509591845191645741470653974460714522358362695848905641897492888805,8055056222854724947534229729362938900393380623061729822034177100602552411684,8841305248627005490684435068554866336037281409872841166256499053913855667663,17393617880011961063722177156687167597785515650731345358017594453156801841750,9134812782946246477382749501756521033191131648169155399660755523243809924985,5874460545438495447360509618099907294916375005598494526462684352297251031338,16069591515142379111204703045096550819428436131949339386521861704948485407043,11962120239408032609083758269415656400682277263025948496448227609373701557647,2998751751135582910454267866182036306022286179637831158023751086688017088453,17361132210337219581729837662000018081706586352038127359850835578169064024627,16048207551507412141663801408246194149328805387019287537086161573266055846336 against txTypeEnumUint 1
      ✅  Uploaded verification key for createPO. TxHash: 0x1cc5f0e43b810394e655cafc889b1191d5a874d1d3847269182662df13479e9f
      ----------------- Completed  -----------------
      Please restart the radish-apis for the config to take effect
   ```

4. run `docker-compose up -d`

   * This will start all `radish` containers
   * Wait about 10 seconds to give containers time to complete their initialization routines
   * Run `docker-compose logs -f {SERVICE_NAME}` to check the logs of specific containers. Key ones to watch are: `api-{role}` and `ui` Example Logs:

   ```text
      radish-api-buyer        | Connected to db
      radish-api-buyer        | Mongoose connected to db
      radish-api-buyer        | Loading config file ...
      radish-api-buyer        | 🚀 Internal REST-Express server listening at http://localhost:8101
      radish-api-buyer        | Loading network http://ganache:8545...
      radish-api-buyer        | Connected to network: { chainId: 333, name: 'unknown' }
      radish-api-buyer        | Whisper key: 0x0453f6d033725be702e7e00a0056a62caa5c3700796899dbc69d2001a1dae1717b65d30ed3e7e607f8f00bfc69f09c0e22ef69fcee7cd6980434de34863c21491d
      radish-api-buyer        | Loading wallet with address  0xB5630a5a119b0EAb4471F5f2d3632e996bf95d41
      radish-api-buyer        | Wallet balance: 999.89182446
      radish-api-buyer        | Your organization has already been registered with the registry
      radish-api-buyer        | All systems go.
      radish-api-buyer        | 🏥  Healthcheck Status: ready
      radish-api-buyer        | 🚀 Server ready at http://localhost:8001/graphql
      radish-api-buyer        | 🚀 Subscriptions ready at ws://localhost:8001/graphql`
   ```

5. Run integration tests: `npm run test`
6. Within about 5 minutes, UI is loaded on `http://localhost:3000` on your local browser

## Troubleshooting

1. If you get errors during the `npm i` step, please ensure that you are running node version `11`. The `nvm` \(node version manager\) tool allows you to easily switch between versions:

```text
nvm install 11
nvm use 11
```

1. Restart the test environment
   * Run `docker-compose down` to stop containers
   * Run this command to give the docker command a clean slate: `docker volume prune -f && echo volume pruned && docker system prune -f && echo system pruned && docker network prune -f && echo network pruned`
   * In some cases, due to stale images application may have build issues owing to existing images and packages that were a part of those builds. To get around such issues, run `docker-compose build --no-cache` to run a clean re-build of the docker images
   * run through the 'steps to start the application' in **Development/Test Environment**
2. Increase RAM allocated to Docker
   * Consider these steps if you are running many of the `radish` containers and your PC is bogged down
   * Check the memory usage by running `docker stats`
   * If the containers are using most of the RAM allocated to Docker, you can increase RAM available to Docker by clicking the Docker Desktop icon in the task bar. Choose `Preferences --> Advanced`, then increase `Memory` to a recommended `12.0GiB` \(default is `2.0GiB`\).

### Front-end Environment

1. When the above setup is run successfully, the UI is ready at `http://localhost:3000`
2. Typically, this process takes about a minute to two. Successful loading of UI at the url can be inspected based on the logs of the `ui` container. Example Logs:

   ```text
      radish34-ui_1           | > @ start /app
      radish34-ui_1           | > react-scripts start
      radish34-ui_1           |
      radish34-ui_1           |
      radish34-ui_1           | Starting the development server...
      radish34-ui_1           |
      radish34-ui_1           | Compiled successfully!
      radish34-ui_1           |
      radish34-ui_1           | You can now view undefined in the browser.
      radish34-ui_1           |
      radish34-ui_1           |   Local:            http://localhost:3000/
      radish34-ui_1           |   On Your Network:  http://172.27.0.14:3000/
      radish34-ui_1           |
      radish34-ui_1           | Note that the development build is not optimized.
      radish34-ui_1           | To create a production build, use npm run build.
   ```

