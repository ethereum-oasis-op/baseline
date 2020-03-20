---
title: Application Service component
description: Detailed explanation of the UI components of the Radish34 implementation
---

# Application Service component

## What is here?
This component is a React based UI using graphql to interface with the API.

## How does this fit in to Radish?
This is the front end piece/demo to Radish. Something to keep in mind, however, the UI application here is just an example of how any external application can interact with the Radish API. In reality, this can as well be replaced with a different UI framework; integration with a custom UI brought in from legacy systems; integration with existing ERP or contract management systems, etc.

## How can I run it?
1. `cd ui/`
2. `npm install`
3. Make sure dotdocker is installed and running.
  - `dotdocker start`
4. Start up the ui service
  - If you would like to run the UI service alone you can run: `docker-compose up -d ui`
  - Otherwise you can simply run `docker-compose up -d`
  - Navigate to `http://localhost:3000/`

In view of the procurement application, when you stage up the application, the following steps show how the different processes can be run/demo'ed using a UI
RFP: Buyer selects create new RFP on the top left corner of the UI, and selects suppliers to send RFP to. Upon submitting an RFP, the supplier screen gets updated with an incoming RFP which they can view and fill out a form to submit a proposal as a response. Upon submitting the proposal, the buyer screen then gets updated with an incoming proposal which when they click to view will link them to the original RFP where they can view the details of a proposal and decide whether or not to create a Contract (msa) for.
MSA: When the buyer receives a proposal, they can choose to create a contract for it which turns into an MSA. Upon creating an MSA, the UI gets updated with an outgoing MSA which they can click into in order to view. For the purposes of the demo, the supplier automatically verifies the MSA data as well as the signature and sends back the signed MSA to the buyer. When this happens, the MSA details will update to have supplier signature approved instead of pending.
PO: To create a PO you can select 'Create a new Purchase Order' from the dropdown on the top left corner of the UI. Once selected it will navigate you to the Purchase Order creation form which will show you which active MSAs you may submit a purchase order against. When you select an MSA the sku field on the form will auto-populate and you can fill out the rest of the values. When you enter in a volume, the MSA card components will update with corresponding prices, it is not possible to submit a PO for more volume than the MSA tier bounds provide. Once submitted, the Buyer will have an outgoing Purchase Order and the Supplier will have an incoming Purchase Order.

Notes:
  - MSA can take roughly 1 minute and 35 seconds to be completely created. From a ui perspective this doesn't block us from doing anything and in fact, even though not all the back end pieces have been completed yet, we can still view the data from an MSA.
  - Creation of Purchase Order (PO) can take roughly 1 minute and 35 seconds as well. Unlike the MSA, the Purchase Order when created won't update the UI until the complete process has finished on the back end.

## What is the architecture? 
A lot of the principals when writing the React components were:
  1. Pages are "smart" components that house lower level components and tell them what to do.
  2. Lower level components are simple and shouldn't have too much logic in them.
  3. For global state updates from API we decided to use React's context API over using Redux because we felt that having graphql and redux was too much for what we needed.

## How can this be improved?
There are a few optimizations that can be made and components that can be refactored.
  1. Pagination
  2. GraphQL query optimizations
  3. React contexts
  4. Components that have more responsibility than they should that could be broken down into separate components
  5. Error/Success handling, we have a way in place to do this currently through `ToastrContext` the concept behind this is you would use the context in the layout component. The way it works is there is a graphql subscription which can be emitted from the API and when the UI picks up that subscription it will render a notification in which ever corner of the screen specified. While we do have this in place we are currently not using this anywhere.
  6. There are times where the MSA commitment never gets updated with the leaf index where it gets stored in the merkle tree, this will prevent us from creating a PO for that MSA and the MSA is essentially useless. There are also times where the creation of a PO simply doesn't happen, and the UI doesn't know why. From a ui perspective we need to know how to handle these cases. Also, for creating a PO specifically, if you submit multiple Purchase Orders at a time for a particular MSA none of them will get created. The UI needs to know when it is acceptable to submit a new Purchase Order.
