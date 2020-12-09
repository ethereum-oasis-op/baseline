# Baseline Process

## Local System of Record <a id="local-system-of-record"></a>

Parties store data in local systems of record \(Mongo, Oracle, SAP, etc\). Components involved in the baseline process are given CRUD access to this and conduct a series of operations to serialize records \(including any associated business logic\), send those records to counterparties, receive the records, sign them, generate proofs, and store these proofs to a Merkle Tree on the Mainnet. 

Connectors for various systems can be found [here](https://github.com/ethereum-oasis/baseline/tree/master/examples/bri-1/lib).

## Setting up the Workgroup <a id="setting-up-the-workgroup-and-sending-messages-to-counterparties"></a>

The first step in baselining is setting up the counterparties that will be involved in a specific Workflow or set of Workflows. This is called the Workgroup. One initiating party will set this up by either:

* Adding an entry to an existing OrgRegistry smart contract on the Mainnet;
* Selecting existing entries on a universal OrgRegistry;
* Creating a new OrgRegistry and adding entries to it.

> #### _A Corporate Phone Book?_
>
> _It is possible over time for a single instance of an orgRegistry contract on the Mainnet to become a defacto "phone book" for all baselining counterparties. This would provide a convenient place to look up others and to quickly start private Workflows with them. For this to become a reality, such an orgRegistry would need to include appropriate and effective ways to verify that the entry for any given company is the authentic and correct entry for baselining with that entity. **This is an opportunity for engineers and companies to add functionality to the Baseline Protocol.**_

Next, establish point-to-point connectivity with the counterparties in your Workgroup by:

1. Pull their endpoint from the OrgRegistry
2. Send an invitation to connect to the counterparties and receive authorization credentials

Now the counterparties are connected securely.  A walk-through of this process is [here](https://youtu.be/ZgaAcQvoD_8). 

## Setting Up a Workflow

A Workgroup may run one or more Workflows. Each Workflow consists of one or more Worksteps. 

#### Business Logic and Zero Knowledge Circuits

Before creating a Workflow, you must first create the business rules involved in it. The simplest Workflow enforces consistency between records in two or more Counterparties' respective databases. 

More elaborate Workflows may contain rules that govern the state changes from one Workstep to the next.  These can be written in zero knowledge circuits, and in a future release, one will be able to send business logic to counterparties without constructing special zk circuits \(but allowing the core zk "consistency" circuit to check both code and data\). 

To set up this business logic, use the Baseline Protocol Privacy Package [here](https://github.com/ethereum-oasis/baseline/tree/master/core/privacy).

#### Deploying the Contracts

Once the business logic is rendered into circuits, deploy the Workflow as follows: 

First deploy a Node that has the baseline protocol RPC interface implemented. The Nethermind Ethereum Client is the first to implement this code. Alternatively, you can deploy the [commit-mgr](https://github.com/ethereum-oasis/baseline/tree/master/examples/bri-2/commit-mgr) Ethereum client extension plus a client type of your choice (i.e. Besu, Infura, etc.)

Next, use the `IBaselineRPC` call in the Client to deploy the Shield and Verifier contracts on-chain. This can be found [here](https://github.com/ethereum-oasis/baseline/tree/master/core/api). 

#### Running Worksteps

Now that the Workgroup and Workflow have been established, counterparties can send each other serialized records, confirm consistency between those records, and enforce business rules on the state changes from Workstep to Workstep.

An example of this is in the BRI-1 Reference implementation [here](https://github.com/ethereum-oasis/baseline/tree/master/examples/bri-1). And a walkthrough of an "Alice and Bob" simple case is [here](https://youtu.be/2WXvTHR4_7Q) and [here](https://youtu.be/R0AEww6fKLk).

