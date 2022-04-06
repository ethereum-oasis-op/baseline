# The Core Specification

The draft of the CORE specification document is available on [Github here](https://github.com/eea-oasis/baseline-standard/tree/main/core).

## CORE Specification Overview

The Baseline Protocol provides a framework that allows Baseline Protocol Implementations (BPIs) to establish a common (business) frame of reference enabling confidential and complex (business) collaborations between enterprises without moving any sensitive data between traditional Systems of Record.

The CORE specification describes the minimal set of business and technical prerequisites, functional and non-functional requirements, together with a reference architecture that when implemented ensures that two or more systems of record can synchronize their system state over a permissionless public Distributed Ledger Technology (Consensus Controlled State Machine) network. It covers the following:

### Design and Architecture

This section provides definitions, key concepts, and overviews of the components of a Baseline Protocol Implementation compliant with the requirements of the specification. It provide implementers with guidance to be able to build and operate implementations of the Baseline Protocol not only in an informal context but also in a very formal, highly regulated context.

### Identifiers, Identity and Credential Management

Identity in the context of the specification is defined as Identity = \<Identifier(s)> + \<associated data> where associated data refers to data describing the characteristics of the identity that is associated with the identifier(s). The approach is that every identity is controlled by its Principal owner and not by a 3rd party unless the Principal Owner has delegated control to a 3rd party.

### BPI Abstraction Layers

BPI Abstraction Layers are the critical umbilical cords of a BPI to its underlying CCSM and external applications such as System of Records or other BPIs. A BPI has two abstraction layers - the BPI and the CCSM Abstraction Layer -- the specification defines a set of common requirements and differentiates between the two where necessary.

### Middleware, Communication, and Interoperability

This section of the specification focuses on the concepts and requirements that describe the key capabilities to connect the BPI Abstraction Layer to the BPI Processing Layer and the correctness preserving integration of different BPIs.

### Agreement Execution

Agreement execution within the context of the specification is the deterministic state transition from state A to state B of a state object in a BPI, and where the state object represents a valid agreement state between agreement counterparties.

### General BPI Storage Capabilities

BPI storage is a key enabler to scale BPI stacks that are either data-intensive or data sensitive or both. The specification defines BPI data storage -- outside of a CCSM -- as the storing of information in a digital, machine-readable medium where the data stored is relevant for the proper functioning of the BPI stack.

### Conformance

This section specifies the conformance levels of the Baseline Protocol Standard. The conformance levels aim to enable implementers several levels of conformance to establish competitive differentiation.
