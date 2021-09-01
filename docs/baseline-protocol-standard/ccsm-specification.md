# CCSM Specification

## CCSM Specification Overview

Distributed Ledger Technology or Consensus Controlled State Machine \(CCSM\) is the foundational enabler of a Baseline Protocol Instance \(BPI\) with no or limited trust assumptions. The requirements that a CCSM must satisfy for it to be used in a BPI are defined in the CCSM specification of the Baseline Standard. They fall into the following categories:

### Security

CCSM security is one of the most important characteristics of a CCSM. The specification sets requirements for CCSMs supported cryptographic algorithms and their implementations, node key management and verifiably secure execution frameworks.

### Privacy

CCSMs range in the level of privacy they support. One approach ensures that the contents of a CCSM transaction or storage are meaningless to parties not participating in an interaction. Another more stringent approach is to use a CCSM that precludes the accessibility of such information to non-participating parties. The specification sets the minimum requirement to the first approach, but the parties can agree to require that the BPI supports the second approach.

### Scalability

To support the required commercial transaction volume between Baseline Protocol counterparties, the CCSM utilized by a BPI should be chosen with these transaction volumes in mind. Especially, since in a public CCSM setting there will be, potentially, a significant volume of transactions competing for scarce Block space.

### Interoperability

The specification sets requirements for when transactions connect one CCSM with another CCSM for the purpose of interoperating assets or data across BPIs. It addresses two cases - when CCSMs use the same CCSM Protocols and when they use different CCSM Protocols.

### Network

Network in this context refers to the nodes of a CCSM that form the CCSM network. A CCSM node has several components that impact the network namely its Peer-to-Peer \(P2P\) message protocol and its consensus algorithm.

### Consensus

The consensus algorithm is the most important component of a CCSM as it ensures the consistency of the network at any given time. Therefore, the requirements on the consensus algorithms are very stringent.

### Virtual State Machine

CCSMs most often utilize a virtual state machine \(VSM\) for CCSM computations of CCSM state transitions; a digital computer running on a physical computer. A VSM requires an architecture and execution rules which together define the Execution Framework.

### Data Integrity & Transaction Completeness

Data integrity over time, in other words the inability to alter data once it has been committed to the state of the CCSM, is one of the key features of typical CCSMs.

### Integration to External Applications

Depending on the CCSM employed in the implementation of a BPI, the security requirements around integration need to be fulfilled either by the CCSM itself used for the implementation or, alternatively by the CCSM Abstraction Layer.

## CCSM Specification Document

The draft of the CCSM specification document is available on Github: [here](https://github.com/eea-oasis/baseline-standard/blob/main/DLT/baseline-dlt-v1.0-psd01.md).

