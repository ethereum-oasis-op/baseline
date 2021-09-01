# FAQ

## Is there a token for the Baseline Protocol?

There is no Baseline Protocol token.

The Baseline Protocol is an approach, a set of techniques which requirements are specified in the Baseline Protocol Standard, an Oasis open standard and which technology is available open-source. The Baseline Protocol standard and source code are available under the CC0 1.0 Universal public domain dedication. For the full license text, refer to [license](https://github.com/eea-oasis/baseline/blob/master/LICENSE).

Being open-source, open-standard means that anyone is free to build any application or service implementing the protocol. Those applications/services may or may not have their own tokens.

## I am interested in contributing, where do I start ?

* _a contributor_: Anyone with a Github ID can submit pull requests, create and edit their own Issues. You don't need any special access to the repo to get involved and start contributing. For more information, see [here](../community/open-source-community/contributors.md).
* _a member_: Contributors can become members of our Github Organization, which allow them to get invitations to key meetings, be assigned to Issues, and vote for Technical Steering Committee members. For more information, see [here](../community/open-source-community/members.md).
* _a core developer_ : Members can become core developers and have a direct hand in deciding what work is merged to the Main/Master Branch to become official Baseline Protocol technology. For more information, see [here](../community/community-leaders/maintainers.md).

## I want to build with Baseline Protocol, where do I start?

**Baseline Protocol v1.0 core:**  If you want to build with the Baseline Protocol from scratch, you can get started with v1.0 core that provides a set of 'vanilla' packages. You can get started [here](../baseline-protocol-code/packages/).

**Reference Implementations:** You can also choose to build on top of existing reference implementations. ****We recommend starting with BRI-1. This reference implementation of the core interfaces specified in the v1.0 release has been developed by individuals and companies community leaders including Provide, EY, Nethermind, ConsenSys, and others. It heavily utilizes the core [Provide](https://provide.services) application stack and is compatible with [Shuttle](https://shuttle.provide.services/waitlist), an on-ramp for _baselining_. [NATS](https://nats.io/) and the [Nethermind](https://nethermind.io/) Ethereum client \(the first client to implement the Baseline Protocol RPC\) are opinionatedly used by default. You can get started with BRI-1 [here](../bri/bri-1/).

**Developer Resources:** To help you build with the Baseline Protocol, you can use the implementation guide and other developer resources available [here](../baseline-protocol-code/developer-resources.md).

## My company is interested in baselining, how to start ?

The Baseline Protocol enables confidential and complex \(business\) collaborations between enterprises without moving any sensitive data between traditional systems of record.

While 'baselining' as a technique is not restricted to commercial use cases, a Baseline Protocol Implementation \(BPI\) as specified in the Baseline Protocol Standard requires at least two organizations to come together to synchronize their respective systems of record. 

A group of companies interested in 'baselining' can either deploy their own implementation using their in-house resources or they can choose to work with third-party partners \(product and service providers\).

A list of Baseline-compliant providers will be made available in 2022.

## Which systems of record can we 'baseline'? <a id="which-systems-of-record-can-we-baseline"></a>

Any systems of record can be baselined without requiring any modification to legacy systems. A [Baseline Protocol stack](architecture.md) is required to manage all messaging and transactions between counterparties and between counterparties and their agreed common frame of reference.

## Does 'baselining' require a blockchain?

Distributed Ledger Technology referred to as Consensus Controlled State Machine \(CCSM\) is the foundational enabler of a Baseline Protocol Implementation \(BPI\). A compliant BPI requires conformance to the CCSM specification of the Baseline Protocol Standard. For more information, see [here](../baseline-protocol-standard/ccsm-specification.md).

## Does 'baselining' require Ethereum and/or Baseledger ?

While much of the initial work on the standard and the code was done by companies and individuals in the Ethereum development community, any CCMS that conforms to the CCSM specification of the Baseline Protocol Standard can be used in a compliant Baseline Protocol Implementation \(BPI\).



