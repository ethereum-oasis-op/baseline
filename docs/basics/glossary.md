# Glossary

## Key Concepts

### Baseline Protocol

A set of components and procedures that allows separate systems of record to maintain record consistency and workflow integrity by using the public Ethereum Mainnet as a common frame of reference \(CFR\).

### Atomic Compartmentalization

Even counterparties to the same business-to-business Workflow typically must not have access to -- or even awareness of -- processes that they are not directly involved in. A Workflow that can restrict access and awareness to a specific set of Parties down to a single Step or Record has achieved "atomic compartmentalization." With the Mainnet, this kind of compartmentalization can be said to be "silo-less," because, while each Step in a Workflow can restrict awareness and access, different Workflows -- even ones created and operated separately over a long period -- can integrate Steps. Workflow A can pass parameters between it Step A\#33 with Workflow B's Step B\#22, if done with care, and the logic and data can be made compatible. There is still work there to integrate the different Workflows, but because they are all baselined on the same Mainnet, this can be done at the application/business-process level. One need not call a network administrator to set up a new channel or figure out which private blockchain network will be primary. 

### **Mainnet**

The Mainnet is an always-on state machine that is maintained as a public good in such a way that it maximizes the resistance to an individual or group to gain control, lock out users from valid functions, or change history. The term, Mainnet, is capitalized to emphasize its relationship to the capitalized Internet.

Used without capitalization to distinguish a public production network from public testnets. For example, the Ethereum mainnet vs. its testnets, such as ropsten.

### Middleware

There are many forms of middleware. We use the term in the context of the Baseline Protocol in a particular way. Systems of record maintained by legally separate entities require a common frame of reference in order to run business process integration across them. Flow control, ensuring that two processes don't run inappropriately against the same shared state, terminating the back and forth of the [two generals problem](https://en.wikipedia.org/wiki/Two_Generals%27_Problem), non-repudiation, etc. In this context, the protocol is primarily about loose-coupling architecture in the transaction-processing middleware \(TPM\) area. It is not necessarily about schema translators, though a typical system would very likely run CRUD access between a baseline server and a system of record through translation services in a traditional Enterprise Service Bus \(ESB\). Unlike some RPC middleware, the Baseline Protocol is asynchronous, though it is certainly about passing parameters between functions running on two or more remote machines...and ensuring consistency between them.

### 

### 

## Baseline Protocol Components and Conventions

### Workgroup

lorem ipsum

### Workflow

lorem ipsum

### Step

lorem ipsum

### Task

lorem ipsum

### CodeBook =&gt; Package

During the Radish34 project, the notion of a shared "codebook" was often discussed. This is ...

### Registrar

The highest level of \[Radish34\] contract that inherits from ERC1820 and defines a WorkGroup.

### orgRegistry

The set of Parties involved in a WorkGroup defined by a \[Registrar\]

Entanglement

Parties and Counter-Parties

### Baseline Proofs



## Radish34-Specific Terms

RFP

Bid

Proposal

MSA

PO





## 

