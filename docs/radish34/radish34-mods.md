# Modifying Radish34

The Radish34 functional proof-of-concept \(POC\) demonstrates only a few key steps in a procurement process. The UI shows the setup of a [Workgroup](../basics/glossary.md#workgroup) and a [Workflow](../basics/glossary.md#workflow) that includes an RFP, Bids, a signed MSA, and POs to be calculated against the terms of the MSA. Each of these is called a Workflow Step, and the current version of Radish34 focuses heavily on the MSA and PO steps to demonstrate the full capability of on-chain and off-chain components of the Baseline Protocol.

But what if you wanted to add tokenized inventory, shipping & logistics, invoicing, or trade finance functions like invoice factoring?

As a POC, it is certainly true that the [code](https://github.com/ethereum-oasis/baseline) of Radish34 still needs to add a layer of abstraction to take it to the next level as production-capable code for supply chain applications. This would be a good place for community members to chip in, irrespective of the additional generalization effort of going from [POC to Protocol](poc-to-protocol.md).

An example of this is the code for the MSA, which you can find in the repo \[ here \]. Strictly speaking, the MSA is an instance of a Workflow [Step](../basics/glossary.md#step). A Step can implement a number of Tasks. The MSA implements, for example, a specialized zero knowledge circuit specially written to enforce the correctness of the business logic involved in calculating a PO’s correct volume discount. It also implements general Tasks, such as \[ Patrick \], messaging, digital signatures, and the process of generating, validating and storing the proof \(in this case, a state marker representing the rate table and the total number of units ordered\), and nullifying a previous proof when the state has changed.

So how would you take this code and make it work for something we haven’t written yet into this POC? How would you make an an Invoice Step, for example?

## Baselining an Invoice

We will shortly run a session on what one would do to modify the existing Radish34 code to make a new Workflow Step like a POC. In that process, we will discover and discuss ways to abstract the Radish34 code and generalize it to develop a proper Baseline Protocol and standard. **Stay tuned!**

