# Transthereum - Unibright Freequity Blockchain Explorer
Exploring a ganache-cli blockchain node during development in etherscan style.

This project was developed during a hackathon in Unibright to serve the purpose of exploring our ganache-cli blockchain node during development of Unibright Freequity decentralized exchange. We decided to build it because we could not find a good tool to help us visually track the transactions in ganache-cli. This is also why we decided to open-source it. It is not optimized to be used against a real network (Ropsten, Rinkeby) because of large number of blocks, as those network already have mature explorers. It contains functionalities Unibright devs need during development, examples of implementation of some key features needed when querying the blockchain and can serve as a playground for experimenting.

The project consist of a Dotnet Core backend and Angular frontend and relies on the Nethereum library to talk to the blockchain.

## Features

### Get latest blocks

### Get block by height

### Get latest transactions

### Get transaction by hash

### Get address with transactions and token balances

### Parse transaction inputs*
*Parsing of transaction inputs in order to get specific Unibright Freequity trade information.Easily extensible for different purposes. For details, have a look at `ITransactionParser.cs` and its implementation.   

## Running

Prerequisites: dotnet core 2.2 and nodejs 12.x

Run `dotnet run` in the root\backend folder.

Run `npm i` followed by `npm run start` in the root\frontend folder.  

## Configuration

Located in the appsettings.json

"BlockchainURL": "ganache-cli url"

"ExchangeContractAddress": "Contract address for which we want to parse inputs"

"AbiFilename": "Contract abi for which we want to parse inputs"

"Tokens": [  
{

"Address": "Contract address of the token we want to query for balances"

"Name": "Token name"

"Symbol": "Token symbol"

"DecimalPlaces": "Token decimal places"

"MarketId": "Id of the Unibright Freequity market related to this token"

"TraderContractAddress": "Contract address of the contract in charge of trading on this market"

}]
