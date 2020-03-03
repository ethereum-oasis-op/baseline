# Welcome to Baseline

<div align="center">
  <img src="docs/baseline-logo/Web/examples/PNGs/horizontal/baselineHorizontal-Logo-FullColor.png" />
  <p>
    Combining advances in cryptography, messaging, and blockchain to execute
    <br/>
    secure and private business processes via the public Ethereum Mainnet.
  </p>
  Read the full documentation <a href="https://radish.gitbook.io/docs/-LuE-E657uooMibsj9_Y/">here</a>.
  <p>
    <em>Join our <a href="https://communityinviter.com/apps/ethereum-baseline/join-us">Slack workspace</a> for Baseline news and updates!</em>
  </p>
  <br/>
</div>

__Baseline__ is an open source initiative with a large and growing team of supporting companies. The first code was donated by Ernst & Young and ConsenSys, with support from Microsoft, and is now receiving contributions from many other companies. The purpose of the project is to bring enterprises and complex business processes to the Ethereum Mainnet, while guarding the privacy constraints and needs of a typical group of enterprises. 

The __Baseline Protocol__ defines a series of steps to follow to privately and securely synchronize data inside two independent databases, using the Ethereum Mainnet as an auditable common frame of reference. This protocol implements best practices around data consistency and compartmentalization, and leverages public Ethereum for verifying execution of private transactions, contracts and tokens on the mainnet using ZKP (zkSnarks). The __Baseline Protocol__ is designed such that it can be extended and applied to any database/workflow.

# Radish34

In order to demonstrate the __Baseline Protocol__, we needed a use-case. The use-case chosen was product procurement within a supply-chain, and the custom application built for this workflow is called __Radish34__.

The __Baseline Protocol__ code is currently embedded inside the `/radish-api` directory, but we are in the process of moving that code into the `/baseline` directory to clearly distinguish the protocol from the use-case. Once this move is complete, `radish-api` will import `baseline` as a module, which will be the same process that other projects will need to follow to implement __Baseline__.

To run the __Radish34__ application, follow the instructions in `/radish34/README.md`.

# How to contribute?

__Baseline__ is an open-source project that is actively seeking contributions from any willing participants. Here are some guidelines for people that would like to contribute to the project.

## Submitting an issue

To help us get a better understanding of the issue you've identified, follow the guidelines in one of our *Issue Templates*.

## Submitting a pull request

Follow these steps when submitting a pull request:

1. Fork this repo into your GitHub account. Read more about forking a repo on Github [here](https://help.github.com/articles/fork-a-repo/).
1. Create a new branch, based on the `master` branch, with a name that concisely describes what you’re working on (ex. `add-mysql`).
1. Ensure that your changes do not cause any existing tests to fail.
1. Submit a pull request against the `master` branch.

# License

All code in this repo is released under the CC0 1.0 Universal public domain dedication. For the full license text, refer to `license.md`.
