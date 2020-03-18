# Zero Knowledge Service

## ZK in a Nutshell

zk-SNARK stands for "Zero Knowledge Succinct Non-Interactive Argument of Knowledge", and is a family of privacy tools called zero knowledge proofs \(ZKP\). While other privacy techniques like bulletproofs, ring signatures and stealth addresses, etc. mask the identities of the entities involved in a business transaction, ZKP techniques allow to prove logical statements without divulging any information and yet proving the validity of such proofs. Particularly, zk-SNARKs are mathematical concepts and tools to establish zero knowlege verification of succinct proofs, which convert logical statements to arithmetic circuits, that are then leveraged to generate proofs.

> Normally zk-SNARKs are used as a way to say "I have a secret" to someone and prove that you indeed have the secret without telling them what the secret is.   What the Baseline Protocol uses it for is a little different. It's more like saying to a specific set of counterparties, "We have a secret" and using a machine that we all can access to tell us that we all have the same secret \(or that we do not\) _without_ telling that machine anything that would let someone else with access to it discover anything about the secret...or even that we have one.

There is a good backgrounder on ZK and how it is used in the Radish34 demo in the repo here:

{% embed url="https://github.com/ethereum-oasis/baseline/tree/toplevel-restructure/radish34/zkp" caption="ZK and Zokrates Component in Radish34" %}

## ZK in the Baseline Protocol

The Zero Knowledge \(ZK\) service in the Baseline Protocol does one essential thing and one optional thing:

**Essential**: Receives EdDSA signatures back from the Messenger service, validates that all signatures required by the Workflow Step are received and show consistency, and sends the Proof \(a hash\) and other verification/validation material to the Mainnet -- specifically into a Shield Contract that checks a Verifier contract  before depositing the Proof into a Merkle leaf inside the Shield Contract.

**Optional**: In cases where it is important that the business logic followed by all counterparties conforms to a set of specifications, a special ZK "Circuit" can be constructed in a domain-specific language \(DSL\) like [Zokrates](https://github.com/Zokrates/ZoKrates) to enforce "correctness." For example, in the Radish34 demo, the Master Service Agreement Circuit enforces, among other things,  that the rate table has no gaps between tiers. So a rate table where `0 - 10 units` is followed by   `12-22 units` would be rejected by the Circuit.

### Why Use a Special Circuit?

The core of the baseline approach is the notion of a _consistency machine_.  Consistency here indicates consistency of data and logical transformations therewith of the data. You want to know that the states of different machines are the same and then use that as flow control for enforcing the integrity of subsequent Workflow Steps. This can be done with a simple, standardized, repeatable ZK Circuit. Essentially, this lends to a standardized approach to plug a circuit for custom business logic that can be extensible and reusable depending on custom business scenarios and cases. 

It costs more in Mainnet $gas fees and in time to set up specialized circuits. But with advances in ZK, the cost has come down to where an initial test of the Radish34 MSA was in the low tens of cents, depending on the price of Ether. 

**An Opportunity for Standards and Regulation:** Typically, a small group of counterparties may be fine relying on a code package shared between them to be correct. All they need know is that everyone executed it correctly based on the same inputs, which generated the same outputs. But consider a set of companies in a highly regulated industry. An industry standards body could publish a set of Circuits/packages/libraries and require their use when regulated companies _baseline_ their Workflows. This would allow the regulated companies, potentially, to reduce the cost of oversight by ensuring the business logic they used to conduct business with their counterparties was done correctly and in accordance with the regulation...or at least with the enforcement Circuits provided. 



