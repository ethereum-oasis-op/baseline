---
description: Frequently Asked Questions
---

# FAQ

## Is there a token for the Baseline Protocol?

There is no Baseline Protocol token.

The Baseline Protocol is a standardized framework, with requirements outlined in the [Baseline Protocol Standard](https://github.com/eea-oasis/baseline-standard), which is undergoing ratification to become an [OASIS Open Standard](https://www.oasis-open.org/standards/).

Being open-source, open-standard means that anyone is free to build any application or service implementing the protocol. Those applications or services may or may not have their own tokens.

The Baseline Protocol Standard and source code are available under the CC0 1.0 Universal public domain dedication. For the full license text, refer to [license](https://github.com/eea-oasis/baseline/blob/master/LICENSE).

## I am interested in contributing, where do I start?

Join our open source teams - learn more and sign up [here](https://www.baseline-protocol.org/get-involved/).

* _**Baseline Core Devs:** Baseline Core Devs_ are the backbone of the Baseline Protocol open source community and have an active role in advancing the Baseline Protocol and/or related projects. Join the next generation of top blockchain developers leading the rise of ubiquitous sync services to state machines everywhere!
* **Outreach Team**: Outreach members communicate, advocate, and educate the world on the advantages of using and contributing to the protocol. Several working groups create enablement materials, devise industry-specific use cases, and document the significant work being done in the community.
* **Standards Team**: Members of the team work to define and contribute to the specifications of baseline compliance. The[ Standard ](https://github.com/eea-oasis/baseline-standard)is currently in the ratification process to become an official [Oasis Standard](https://www.oasis-open.org).

## I want to build with the Baseline Protocol, where do I start?

**Baseline Protocol v1.0 Core:** If you want to build with the Baseline Protocol from scratch, you can get started with v1.0 core that provides a set of 'vanilla' packages. You can get started [here](../baseline-protocol-code/packages/).

**Reference Implementations:** You can also choose to build on top of existing reference implementations.

We recommend starting with BRI-1, this reference implementation of the core interfaces specified in the v1.0 release has been developed by individuals and companies including Provide, EY, Nethermind, ConsenSys Mesh, and others. It heavily utilizes the core [Provide](https://provide.services) application stack and is compatible with [Shuttle](https://shuttle.provide.services/waitlist), an on-ramp for _baselining_. [NATS](https://nats.io) and the [Nethermind](https://nethermind.io) Ethereum client (the first client to implement the Baseline Protocol RPC) are opinionatedly used by default. You can get started with BRI-1 [here](../bri/bri-1/).

**Developer Resources:** To help you build with the Baseline Protocol, you can use the implementation guide and other developer resources available [here](../baseline-protocol-code/developer-resources.md).

Join the [Baseline Core Devs](https://www.baseline-protocol.org/get-involved/) or ping in the [Baseline Slack #devs channel](https://join.slack.com/t/ethereum-baseline/shared\_invite/zt-d6emqeci-bjzBsXBqK4D7tBTZ40AEfQ) with questions.

## My company is interested in baselining, where do I start?

While 'baselining' as a technique is not restricted to commercial use cases, a Baseline Protocol Implementation (BPI) as specified in the[ Baseline Protocol Standard](broken-reference/) requires at least two organizations to come together to synchronize their respective systems of record.

A group of companies interested in 'baselining' can either deploy their own implementation using their in-house resources or they can choose to work with third-party partners (product and service providers).

Get in touch with one of our sponsors for Baseline platforms, tools, solutions, and developer education [here](https://www.baseline-protocol.org/get-baselined/).

## Which systems of record can we 'baseline'? <a href="#which-systems-of-record-can-we-baseline" id="which-systems-of-record-can-we-baseline"></a>

Any system of record can be baselined without requiring modification to legacy systems. A [Baseline Protocol stack](architecture.md) is required to manage all messaging and transactions between counterparties and their agreed common frame of reference.

## Does 'baselining' require a blockchain?

Distributed Ledger Technology, often referred to as a Consensus Controlled State Machine (CCSM) is the foundational enabler of a Baseline Protocol Implementation (BPI). A compliant BPI requires conformance to the [CCSM specification](../baseline-protocol-standard/ccsm-specification.md) of the [Baseline Protocol Standard](https://github.com/eea-oasis/baseline-standard).

## Does 'baselining' require Ethereum and/or Baseledger ?

While much of the initial work on the Standard and the code was done by companies and individuals in the Ethereum development community, any CCSM that conforms to the [CCSM specification ](../baseline-protocol-standard/ccsm-specification.md)of the[ Baseline Protocol Standard](https://github.com/eea-oasis/baseline-standard) can be used in a compliant Baseline Protocol Implementation (BPI).
