---
title: Radish34 Procurement Use Case
description: Layout and detailed description of the procurement use case
---


## Table of Contents
- [Overview](#overview)
- [Scoping And Assumptions](#scoping-and-assumptions)
- [Technical/Design Implications](#technical/design-implications)


## Overview

This document provides a description of the procurement use case as an example/show case of utilizing the public ethereum mainnet for conducting ongoing procurement operations within the constraints of privacy and established baseline requirements to develop a scalable, repeatable and extensible pattern for enteprises.

Based on discussions around scoping and observing general patterns in the procurement industry, a 2 party system of a buyer who intends to procure goods and a supplier (manufacturer), who can provide for the finished goods in exchange for a payment. The key interactions between these 2 parties across the process flow is laid out below.

1. RFP (Request for Proposal): 
    - Buyer places request for proposal inviting suppliers to participate in the procurement process and lays out the procurement needs (quantity, price, etc.)
    - Supplier views the RFP
2. Proposal: 
    - Supplier upon receipt of an RFP, responds back to provide a proposal effectively providing the terms by which the supplier can satisfy the procurement needs of the buyer, privy only to the buyer. As an example, we assume that these terms are a volume discount tiering structure to determine the price of an order
    - Buyer views the details of the proposal
3. Contract (Master Service Agreement): 
    - Buyer uses the terms of the proposal to award a contract or an MSA to the supplier based on the proposal from supplier, and privy only to the supplier
    - Supplier views the agreement, signs the agreement and provides the signed agreement back to the buyer
    - Buyer validates and confirms the agreement
4. Purchase Order:
    - Buyer issues a purchase order to the supplier, privy only to the supplier. Buyer may choose to place an order for any requested quantity in the bounds of the MSA terms. Additionally, the terms of the MSA are used to calculate the price of a given purchase order
    - Supplier views the purchase order

## Scoping and Assumptions

1. All 2 party interactions are meant to be strictly privy between the parties in interaction
2. Data associated with the business process that is legacy to enteprises is never used directly to interact with the blockchain platform
3. Complex interactions such as negotiations between the 2 parties for any of the above processes are left out of scope of this use case coverage
4. For this use case, it is assumed that RFP occurs prior to MSA, even though in reality this order varies based on the parties in interaction and other potential related terms and conditions of the agreeement process
5. RFP in some industries can be publicly distributed amongst multiple suppliers to avoid unfair advantage for one versus the other supplier (for example, in government use cases)

## Technical/Design Implications

Corresponding to the above breakdown of the processes, below is a listing of technical - design/implementation implications based on the process overview and the assumptions. Moreover, the design of the system allows for a gradual build up of architectural components as we proceed from RFP to MSA to PO

1. RFP: Private communication of the RFPs is done via a secure offchain communication channel
2. Proposal: In reality, there may be terms associated with accepting proposals or determining them to valid or not. But for this use case, we assume that there is no onchain validation of an RFP
3. MSA: Co-signing of the documents is a pre-requisite for storing a hash of an MSA on chain. In addition, this process of signing should also ensure that the identity of supplier is never revealed on chain. This is done so by using ZKP (zk Snark) tooling, and the proofs generated offchain that verify that the intended supplier has signed the MSA, are verified on chain
4. PO: Leveraging the terms of the MSA, a PO is created such that the inputs used to determine the price of the PO are never revealed, but can be verified on chain using ZKP technologies like zkSnarks

With RFP there is an onset of pure offchain communication; with MSA this is extended to leverage mainnet for notarization and traceability; and finally with PO this is further extended to using verifiable offchain computation as a trigger to an on chain process of issuing POs as tokens

