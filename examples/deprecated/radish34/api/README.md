---
title: API component
description: Detailed explanation of the orchestration layer to integrate with other backend components
---

# API
## What is here?

This component is a RESTful service built using GraphQL and serves as an orchestration point for interacting with the backend components of the Radish34 server. Along side this container, a watch container is leveraged to compile the files in the api container using babel.

## How does this fit in to Radish?

The Radish34 API component is spun up along with rest of the services that enable the baseline protocol by integrating with the following types of services:
- Privacy Management: Components that use Zero Knowledge Proof techniques to prove business logic execution in a verifiable manner
- Secure Messaging: Component that use Whisper for secure decentralized message communication on the Ethereum platform
- Blockchain: Component that uses the public mainnet for deploying and interacting with the smart contracts

The API container controls the orchestration of the other services using a queue management utility/package called BullJs

## How can I run it?

As part of the set up of the Radish34 server, the API server is stood up as a microservice (docker container).

Run the following instruction to ensure that the service is up:

`docker-compose up -d api-buyer`

This will spin up the `api-buyer` container, which contains RESTful end points for interacting with the service. In the `dev` mode specified by the `docker-compose.yml` file, `babel` runs in the background to compile down to ES5 style code and `nodemon` watches for any file changes so that developers can make changes locally and the container will pickup on them automatically.


## What is the architecture?

![RadishAPIArch](../../../docs/assets/radish34/RadishAPIArch.png)

The Radish server is an instantiation of a microservice (docker) based baseline architecture consisting of the following services:
- API: GraphQL based interface, serving as a gateway to the other services in the Radish server and enabling transactions on the mainnet
- Queue System: Leveraging "BullJS", this service provides queue management and orchestration of other serrvices in the Radish server
- Secure Message Service: Enabled by Whisper, this service provides secure stateless message transport
- ZKP Service: Acting as a wrapper around Zokrates tooling, this service provides means to generate proofs of private logic execution and consistency 
- Mainnet:Radish contracts deployed to the Ethereum mainnet provide the capabilities of non-repudiation, record consistency, workflow integrity and verifications of offchain private business logic execution

## How can this be improved?

- GraphQL schemas that are leveraged for Radish34 solution have been based on requirements gathered and rationalized for this use case. In reality, these can be extended or normalized in the form of standards based on ERP integration standards
- Queuing system leverages a lightweight tool called "BullJS" for setting up queues and managing workflows. This could be further extended or substituted with managed service component for effective management of the queues. Some of this work has been attempted and showcased as a potential extension on the development branch





