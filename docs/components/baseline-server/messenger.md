# Messenger

The messenger service fulfills the requirement of decentralized private messaging between Radish network participants. Each party that runs a Radish system \(and the Baseline protocol\) needs to send private data to each other. In the supply chain use case this private data is in the form of requests for proposals \(RFPs\), Service Contracts \(MSAs\), Purchase Orders, and secret keys/hashes used in the ZKP generation or verification processes. Also, this service adds message delivery receipts and durability to the messages by storing them locally.

## Radish34 Implementation

The messenger service used in the Radish34 demo was [Whisper](https://github.com/ethereum/go-ethereum/wiki/Whisper). This was convenient, as it is supported in Geth and provided a fast way to demonstrate the concept. 

Here's the [**link**](https://github.com/ethereum-oasis/baseline/tree/master/messenger) to the component as implemented in the Radish34 demo.

Convenient as it is, Whisper is not well supported at this time, and it has a number of drawbacks:

* Data is stored and forwarded by nodes on the way to its destination.

## Suggested Implementation

The Baseline Protocol open source community is helping to build a great bla bla to replace Whisper, and you can help....

Here's where you can see the current state of the work on the messenger service.

