# Baseledger Excel

## Overview

Baseledger Excel uses Baseledger Lakewood (https://lakewood.baseledger.net/) testnet and Baseledger's concept TrustMesh (https://docs.baseledger.net/baseledger-concepts/trustmesh) to sync 2 Excel files.

Each new row in Excel is new TrustMesh, and each change on a row is a new version (represented by TrustMesh Entry) that is synced between 2 Excel files. So, each row is a Workflow that contains two Worksteps:
1. First and last name
2. Nickname

First, one party suggests first and last name and is waiting for feedback. Other party can approve and reject, and based on feedback, first party can again propose a new version or proceed to the next Workstep - in this case, nickname, and repeat the same.

Every suggestion and feedback that occurs in this exchange are visually represented in TrustMesh Viz app. Also, each of these has associated Baseledger transactions and links to Lakewood explorer to check transaction details. The payload in the Baseledger transaction is an encrypted representation of the TrustMesh entry. All these Baseledger transactions are bundled and anchored, rolled up into Ethereum as soon as the TrustMesh Workflow is finished. In this example, the final Workstep in Workflow is the nickname.

The behavior of the Excel is programmed using VBA macros.

## Excel structure

In this example, we are using 2 preconfigured nodes that are used for testing purposes, and they are playing the roles of Alice and Bob. Yellow fields represent fields that the user needs to fill out. Excel consists of a couple of sections:

### Identify

This section contains the following information:
1. IP - this is the IP address of the node that Excel is using to perform HTTP requests on node API
- http://alice.lakewood.baseledger.net
- http://bob.lakewood.baseledger.net
2. Access Token - this is a JWT token used for API authorization.
3. TrustMesh Viz - URL of TrustMesh viz app that is used for visually representing TrustMeshes:
- http://trustmesh.alice.lakewood.baseledger.net
- http://trustmesh.bob.lakewood.baseledger.net
4. Etherscan - Ropsten Etherscan URL

### Workgroup

This section contains the following information:
1. Workgroup information (needs to be the same on both Alice and Bob Excel)
- Workgroup ID
- Workgroup Name
- Workgroup Key - secret key used to encrypt TrustMesh entry

2. Organization details
- Organization ID
- Organization Nats endpoint
- Organization Nats token - test token is already provided in Excel

3. Recipient organization details
- Recipient Organization ID
- Recipient Organization Nats endpoint
- Recipient Organization Nats token - test token is already provided in Excel

## Workflow

Data from the above-described sections is added in a wizard-like format. First, you add workgroup, then first participation, and finally last participation.

After all needed data is there, Workflow can be started. Clicking the `Add New` button new row is added and Workflow counter is incremented. One party can send suggestions, other party can check for new suggestions using the `Get New` button. This button is used instead of a polling mechanism to simplify working with Excel. Similarly, every row has `Latest` buttons to get the latest state for each Workstep in order.
The last 2 columns in a row contain links to TrustMesh Viz app and Etherscan. You can check the state of your TrustMesh in each step, and check your transaction when the final Workstep is approved.

## Step-by-step guide

We will use Alice and Bob to explain step by step exchange.

### User-defined fields

Yellow fields need to be filled out this way:
- Workgroup ID - generate UUID v4 (eg. https://www.uuidgenerator.net/version4)
- JWT token - To create and authorize users you can use swaggers: http://alice.lakewood.baseledger.net/swagger/index.html and http://bob.lakewood.baseledger.net/swagger/index.html

### Persist workgroup and participation details

Both Alice and Bob should add workgroup and both participations, by clicking the `New Workgroup` and `Participation` buttons. After this is done `Add New` and `Get New` buttons appear.

### Exchange suggestions and feedbacks

Alice starts the workflow by clicking the `Add New` button, which results in a row being generated in an Excel file. After filling out the Last and First name sections, clicking the `Suggest` button will send out a suggestion to Bob. At that point, Alice is waiting for feedback, and clicking the `Latest` button can poll for new changes.

Bob fetches new Workflows by clicking the `Get New` button. The suggestion sent by Alice will appear and feedback can be given by either clicking the `Approve` or `Reject` button. If the suggestion is approved Alice and Bob can move to the final Workstep (nickname) using the same actions, otherwise Alice should send a new version, by again entering data and clicking `Suggest`.

The last two columns in a row contain TrustMesh viz URL and Etherscan URL. During the whole Workflow Alice and Bob can check the visual representation of TrustMesh by clicking the first URL. After Workflow is finalized, Etherscan URL will contain anchoring to the Ethereum transaction hash.

## Troubleshooting

It is important to add that this example is not production-ready, it is rather a happy path to demonstrate some Baseline and Baseledger concepts. The easiest way to start again in case data gets corrupted, or something is wrong is to revert the Excel document back to the initial version, using git, and then start from scratch using a new Workgroup Id. For people that are familiar with macros, there is a handy `Reset` macro doing the same, resetting Excel to its initial state.