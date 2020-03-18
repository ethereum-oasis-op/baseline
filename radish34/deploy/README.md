---
title: Deployment Job component
description: Detailed explanation of the deployment operations in Radish34 implementation
---

# Deployment Job component

## What is here?

This is a dev utilty/convenience for deploying smart contracts to the blockchain network. Refer to the `contracts/` documentation for detailed explanation of the deployment model.

## How does this fit in to Radish?

During the initialization of the Radish34 system, smart contracts are deployed to the blockchain network. 

## How can I run it?

Run `npm run deploy` to deploy the contracts, which utilize the artifacts updated in the `artifacts/` upon running the build step: `npm run build:contracts`.

## What is the architecture? 

![SmartContractDeployment](../docs/assets/SmartContractDeployment.png)

- Deployment is handled as a one time job wherein ERC1820 standard is used for deploying all the Radish34 contracts
- Deployment operation is handled as being run by a `deployer` as a user. This is done so that the role of an administrative or operator entity could deploy contracts on behalf of a workgroup

## How can this be improved?

- On-demand or adhoc deployment to allow for custom deployment operations at run time
- Upgrade contracts using proxy delegation methods to account for upgradability of the different contracts that are registered with ERC1820: `OrgRegistry`, `Shield` and `Verifier` contracts
- Enhancements to the deployment job for mainnet deployment via a funded wallet
