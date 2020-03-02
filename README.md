# Baseline

__Baseline__ is an open source initiative with a large and growing team of companies supporting it. The first code was donated by Ernst & Young and ConsenSys, with support from Microsoft, and is now receiving contributions from many other companies. The purpose of the project is to bring enterprises and complex business processes to the Ethereum Mainnet, while guarding the privacy constraints and needs of a typical group of enterprises. 

The __Baseline Protocol__ defines a series of steps to follow to privately and securely synchronize data inside two independent databases, using the Ethereum Mainnet as an auditable common frame of reference. This protocol implements best practices around data consistency and compartmentalization, and leverages public Ethereum for verifying execution of private transactions, contracts and tokens on the mainnet using ZKP (zkSnarks). __Baseline__ is built in a way that allows it to be extended and applied to any database/workflow.

Find in-depth documentation [here](https://radish.gitbook.io/docs/-LuE-E657uooMibsj9_Y/).

## Radish34

In order to demonstrate the __Baseline Protocol__, we needed a use-case. The use-case chosen was product procurement within a supply-chain, and the custom application built for this workflow is called __Radish34__.

The __Baseline Protocol__ code is currently embedded inside the `/radish-api` directory, but we are in the process of moving that code into the `/baseline` directory to clearly distinguish the protocol from the use-case. Once this move is complete, `radish-api` will import `baseline` as a module, which will be the same process that other projects will need to follow to implement __Baseline__.

To run the __Radish34__ application, follow the instructions in `/radish34.README.md`.
