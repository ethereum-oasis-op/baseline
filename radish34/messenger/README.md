---
title: Messenger Service component
description: Detailed explanation of the messaging service components of the Radish34 implementation
---

# Messenger Service component

## What is here?

This service sends and receives messages using Whisper. The `messenger` service connects to a running, Whisper-enabled geth client via websocket. A Whisper network must be created by peering each Radish system for message delivery

## How does this fit in to Radish?

The messenger service fulfills the requirement of decentralized private messaging between Radish network participants. Each party that runs a Radish system (and the Baseline protocol) needs to send private data to each other. In the supply chain use case this private data is in the form of requests for proposals (RFPs), Service Contracts (MSAs), Purchase Orders, and secret keys/hashes used in the ZKP generation or verification processes. Also, this service adds message delivery receipts and durability to the messages by storing them locally. 


## How can I run it?

### Requirements
NodeJS v12

### Running the service

The service comes up along with all the other services needed to run Radish from the docker-compose file. For the Radish POC app there are two instances that spin up, one for the buyer and one for the supplier. To run the service on it's own, you need the following supporting services:

- mongo
- redis
- geth client
- ethereum network with Whisper-enabled nodes

### API, Unit Testing
1. Make sure you have all of the necessary npm packages in `./node_modules`
```
npm install
```
2. Build/run the ancillary services needed to run unit tests and test the REST API.
```
npm run deploy:up
```
3. Start the messenger service in the `test` env
```
npm run start:test
```
4. Run the tests
```
npm test
```

### Troubleshooting

If you get errors when running steps 1 or 3 above, please ensure that you are running node version `12.16`. The `nvm` (node version manager) tool allows you to easily switch between versions:
```
nvm install 12.16
nvm use 12.16
```

## What is the architecture? 

<!---
In addition to the images add some description of them explaining each part of the diagram.
I know you think your images are beautiful, self-explanatory works of technical art but please,
for the sake of us dumb sods, write a little about them.
-->

## How can this be improved?

<!---
So that others know what you're planning on doing (and how they might help) 
write about or (ideally) link to existing issues in github that are important to advance the work on the project.
If you link please use github issue filter for your component label (and if you don't have a component label, make one).
E.g. https://github.com/EYBlockchain/radish-34/issues?q=is%3Aissue+is%3Aopen+label%3ADocumentation would show all the documentation issues that are open.
-->




