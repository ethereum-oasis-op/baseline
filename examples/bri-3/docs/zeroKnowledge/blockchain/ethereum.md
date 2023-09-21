# Ethereum Testnet

This document describes the setup and process for interacting with the Ethereum testnet (which is being used as the CCSM for bri-3). The solidity contract is compiled and deployed using hardhat.

## Config

`hardhat.config.ts` contains the required configurations for deploying and interacting with the solidity contract.

The following params are passed as config:

- _defaultNetwork_ : default ethereum network to be used by hardhat when running your code. Whatever network you chose, automatically a provider field (ethers.providers.Provider) for that network is added to ethersjs library and can be used in your code. By default, this value is set to `hardhat`, i.e., the selected network is the hre (hardhat runtime environment). Set it to `goerli` to use the goerli testnet. If you want to test using ganache, simply change this value to `ganache`.

- _networks_ : This parameter includes the url (url for connecting with the selected network) and accounts (wallet account or external account that will be used to deploy your contract).

- _networks/url_ : To use goerli testnet, signup with Alchemy, create an app for your project and copy the https value for `process.env.ALCHEMY_URL`. To use ganache, copy the RPC Server url.

- _networks/accounts_ : To use goerli testnet, connect to goerli network on metamask and create an account. Go to account details and click on Export private key. Copy the private key as the `ALCHEMY_GOERLI_PRIVATE_KEY` in the .env file. Ensure that this account has some ETH for your to transact with. (Use goerli faucet). To use ganache, copy the ganache account private key.

- _solidity_ : Solidity version to use

- _paths/sources_ : Path to the folder containing the solidity contracts.

- _paths/artifacts_ : Path to store the artifacts formed after compiling the solidity contract. These compiled artifacts are used when deploying the contract on ethereum.

## Compile & Deploy Contract

`Ccsm.sol` is the contract for storing the anchor hash on-chain. Run the following command to compile and deploy it to the network of your choice.

`npx hardhat compile`

After compiling the contract, it can be deployed using the `deployContract(contractName)` function of the `blockchain.interface.ts`.

## Store Anchor Hash

`storeAnchorHash(contractName, anchorHash)` function of the `blockchain.interface.ts` connects with the deployed contract and stores the anchor hash.
