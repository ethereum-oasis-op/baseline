# Components

The purpose of the Baseline Protocol initiative is to construct a design-pattern and set of reference implementations and tools that can help developers build _baselined_ offerings, as discussed elsewhere. These are the high-level elements of a basic baseline process.

## Deprecated Components <a id="on-chain-components"></a>

The following components were attributes of the original Radish34 project that led to the Baseline Protocol, but starting with v0.1, they are no longer part of the architecture:

### Registrar "factory" Contract <a id="registrar-factory-contract"></a>

The Registrar contract generates the three main contracts on the Mainnet to bootstrap a WorkGroup.

## On-Chain Components <a id="on-chain-components"></a>

### orgRegistry Contract <a id="orgregistry-contract"></a>

Think of the orgRegistry Contract as a "rolodex" contacts list. In the future, and in particular when the decentralized identity standard \(DID\) is well established, this can be populated from a global "phone book" of pre-verified organizations..so you know when you add a company to your WorkGroup, you are baselining with the company you think you're working with.

### Shield Contract <a id="shield-contract"></a>

The Shield Contract holds a Merkle Tree that holds the Baseline Proofs. The off-chain ZK Service will send the proof to the Shield contract, which will call the Verifier contract. If the Verifier contract returns 'true', then the proof is stored in a leaf on the Merkle Tree.

### Verifier Contract <a id="verifier-contract"></a>

The Verifier Contract is the on-chain component of the ZK Service, which ensures that a baseline proof is only deposited on the Mainnet if all Counter-parties have performed the Workflow Step consistently and have adhered to the rules of any previous Workflow Step. In the Radish34 POC, a good example of this is the MSA to PO Workflow.

## Messenger Service <a id="messenger-service"></a>

The messenger service fulfills the requirement of decentralized private messaging between Parties. Each Party that runs a baselined system needs to send private data to Counter-parties. In the Radish34 supply chain use case, this private data is in the form of requests for proposals \(RFPs\), Service Contracts \(MSAs\), Purchase Orders, and secret keys/hashes used in the ZKP generation or verification processes. Also, this service adds message delivery receipts and durability to the messages by storing them locally.

### Suggested Implementation <a id="suggested-implementation"></a>

The ideal messaging service, which the Baseline Protocol community will endeavor to specify and promote, would:

* Send data point-to-point, stored only by specified counter-parties with no intermediary storage;
* Able to specify different counter-parties on a message-by-message \(or at least Workflow Step by Step\) basis;
* Balance appropriate liveness and safety guarantees optimally for baselining;
* Handle long session management without blocking and without "frankenstein" code.

It has been suggested that the Baseline Protocol community consider looking into the [Corda Flows](https://github.com/corda/corda) open source repository as an example of a potential design pattern that would suit baselining. If so, an effort to implement such a pattern in an Ethereum client such as Hyperledger Besu could be a way forward.

## ZK Service <a id="zk-service"></a>

zk-SNARK stands for "Zero Knowledge Succinct Non-Interactive Argument of Knowledge", and is a family of privacy tools called zero knowledge proofs \(ZKP\). While other privacy techniques like bulletproofs, ring signatures and stealth addresses, etc. mask the identities of the entities involved in a business transaction, ZKP techniques allow to prove logical statements without divulging any information and yet proving the validity of such proofs. Particularly, zk-SNARKs are mathematical concepts and tools to establish zero knowlege verification of succinct proofs, which convert logical statements to arithmetic circuits, that are then leveraged to generate proofs.

> Normally zk-SNARKs are used as a way to say "I have a secret" to someone and prove that you indeed have the secret without telling them what the secret is. What the Baseline Protocol uses it for is a little different. It's more like saying to a specific set of counterparties, "We have a secret" and using a machine that we all can access to tell us that we all have the same secret \(or that we do not\) _without_ telling that machine anything that would let someone else with access to it discover anything about the secret...or even that we have one.

There is a good backgrounder on ZK and how it is used in the Radish34 demo in the repo here:

### ZK in the Baseline Protocol <a id="zk-in-the-baseline-protocol"></a>

The Zero Knowledge \(ZK\) service in the Baseline Protocol does one essential thing and one optional thing:

**Essential**: Receives EdDSA signatures back from the Messenger service, validates that all signatures required by the Workflow Step are received and show consistency, and sends the Proof \(a hash\) and other verification/validation material to the Mainnet -- specifically into a Shield Contract that checks a Verifier contract before depositing the Proof into a Merkle leaf inside the Shield Contract.

**Optional**: In cases where it is important that the business logic followed by all counterparties conforms to a set of specifications, a special ZK "Circuit" can be constructed in a domain-specific language \(DSL\) like [Zokrates](https://github.com/Zokrates/ZoKrates) to enforce "correctness." For example, in the Radish34 demo, the Master Service Agreement Circuit enforces, among other things, that the rate table has no gaps between tiers. So a rate table where `0 - 10 units` is followed by `12-22 units` would be rejected by the Circuit.

### Why Use a Special Circuit? <a id="why-use-a-special-circuit"></a>

The core of the baseline approach is the notion of a _consistency machine_. Consistency here indicates consistency of data and logical transformations therewith of the data. You want to know that the states of different machines are the same and then use that as flow control for enforcing the integrity of subsequent Workflow Steps. This can be done with a simple, standardized, repeatable ZK Circuit. Essentially, this lends to a standardized approach to plug a circuit for custom business logic that can be extensible and reusable depending on custom business scenarios and cases.

It costs more in Mainnet $gas fees and in time to set up specialized circuits. But with advances in ZK, the cost has come down to where an initial test of the Radish34 MSA was in the low tens of cents, depending on the price of Ether.

**An Opportunity for Standards and Regulation:** Typically, a small group of counterparties may be fine relying on a code package shared between them to be correct. All they need know is that everyone executed it correctly based on the same inputs, which generated the same outputs. But consider a set of companies in a highly regulated industry. An industry standards body could publish a set of Circuits/packages/libraries and require their use when regulated companies _baseline_ their Workflows. This would allow the regulated companies, potentially, to reduce the cost of oversight by ensuring the business logic they used to conduct business with their counterparties was done correctly and in accordance with the regulation...or at least with the enforcement Circuits provided.

## UI Integration <a id="ui-integration"></a>

In the Radish34 Demo, the team built a simple web-based UI to simulate the user experience of systems of record that were enabled with the Baseline Protocol. You can find that here: [https://github.com/ethereum-oasis/baseline/tree/master/examples/radish34/ui](https://github.com/ethereum-oasis/baseline/tree/master/examples/radish34/ui)

In the real world, the user experience is the experience of any number of products.

If you are are in charge of the feature/benefit mix of a product in ERP, CRM, SCM, Core Banking or any other type of system of record, you can use the example in the Radish34 UI section to get ideas for how to integrate with baseline components \(whether they have added to your product's internal services or whether they have been deployed as services in your wider IT environment\) and present baselining benefits to users.

​

