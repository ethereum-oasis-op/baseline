# The Baseline Protocol

The Baseline Protocol is an open source initiative that combines advances in cryptography, messaging, and blockchain to deliver secure and private business processes at low cost using the public Mainnet for event ordering, data consistency and workflow integrity. The protocol will enable confidential and complex collaboration between enterprises without moving any sensitive data from traditional systems of record. The work is governed as an [EEA Community Project](https://entethalliance.org/eeacommunityprojects/), managed by [OASIS](https://oasis-open-projects.org).

**The source code can be found** [**here**](https://github.com/eea-oasis/baseline/tree/main)**.**

## Why _Baseline_ Different Systems of Record? <a href="#why-baseline-different-systems-of-record" id="why-baseline-different-systems-of-record"></a>

Businesses spend hundreds of millions of dollars on ERP, CRM and other internal systems of record. Failure to properly synchronize these systems between organizations causes considerable disruption and waste: disputes, lost inventory, inflated capital costs, regulatory actions, and other value leakage. To avoid these problems, systems require a common frame of reference. But only the largest high-volume partnerships can afford the capital expense involved in setting up such integrations. The baseline approach employs the public Ethereum Mainnet as that common frame of reference, because it’s always on, companies can’t be locked out or restricted from using it, and they only need to pay for what they use.

However, past approaches to blockchain technology have had difficulty meeting the highest standards of privacy, security and performance required by corporate IT departments. Overcoming these issues is the goal of the Baseline Protocol.

## Which Mainnet, and Which Version? <a href="#which-mainnet-and-which-version" id="which-mainnet-and-which-version"></a>

The high level description and specification for a global public Mainnet are [here](../baseline-protocol-standard/standards/mainnet.md). And while it is the point of view of many in the Baseline Protocol community that the Ethereum public network is the likely best candidate to serve the function of being the lowest-level common frame of reference for distributed systems, it should be observed that the requirements, not any particular formulation or named service today, are the essential thing. That said, if there is a platform that better matches these specs today, and is more likely to evolve from a position of critical mass (achieved by Ethereum at a key historical moment in 2015) to meet the world's expanding use of it, that platform should step up now.

The Baseline Protocol can perform its core tasks on the current public Ethereum network at a rate that is reasonably expected to be sufficient for work in supply chain, B2B contracting, CRM, and other domains that involve coordinating records between legally separate entities.

Eth2 will further extend the range of applications that baselining can serve at acceptable levels of performance and reliability. The Baseline Protocol community will align closely with Eth2 and work through the EEA Mainnet Working Group to supply the Ethereum core developer community with ideas, user stories and requirements to help see Eth2 evolve into a platform well-suited to baselining.

## Which Systems of Record Can We _Baseline?_ <a href="#which-systems-of-record-can-we-baseline" id="which-systems-of-record-can-we-baseline"></a>

Some providers of ERP, CRM and other enterprise systems are now seen to be optimizing their products for the protocol, but baselining works without requiring any modification to legacy systems.

Any state machine should be able to support the "baseline" pattern. Permissioned blockchains (aka DLT) are state machines. Hyperledger projects like Fabric have Channels, which are, each of them, state machines. Public blockchain networks are also state machines. So ... all of these may use the baseline approach. Their question: what will they choose to use as the common frame of reference.

## Current State of the Baseline Protocol

The Baseline Core Version 1.0 has been ratified by the Technical Steering Committee on the 30th of September 2021 via unanimous vote on a recorded meeting. The standard draft has been submitted to OASIS for ratification to a standard. The submitted version of the document may be found [**here**](https://github.com/eea-oasis/baseline-standard/blob/main/core/baseline-core-v1.0-psd01.md) and the issue related to the approval of the standard may be found [**here**](https://github.com/eea-oasis/baseline-standard/issues/77#issue-1012249365).
