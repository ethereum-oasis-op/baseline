# Glossary

## Baseline Protocol

A set of components and procedures that allows separate systems of record to maintain record consistency and workflow integrity by using the public Ethereum Mainnet as a common frame of reference \(CFR\).

## **Mainnet**

The Mainnet is an always-on state machine that is maintained as a public good in such a way that it maximizes the resistance to an individual or group to gain control, lock out users from valid functions, or change history. The Mainnet is capitalized to emphasize its relationship to the Internet.

Used without capitalization to distinguish a public production network from public testnets. For example, the Ethereum mainnet vs. its testnets, such as Ropsten.

## Middleware

There are many forms of middleware. We use the term in the context of the Baseline Protocol in a particular way. Systems of record maintained by legally separate entities require a common frame of reference in order to run business process integration across them. Flow control, ensuring that two processes don't run inappropriately against the same shared state, terminating the back and forth of the [two generals problem](https://en.wikipedia.org/wiki/Two_Generals%27_Problem), non-repudiation, etc. In this context, the protocol is primarily about loose-coupling architecture in the transaction-processing middleware \(TPM\) area. It is not necessarily about schema translators, though a typical system would very likely run CRUD access between a baseline server and a system of record through translation services in a traditional Enterprise Service Bus \(ESB\). Unlike some RPC middleware, the Baseline Protocol is asynchronous, though it is certainly about passing parameters between functions running on two or more remote machines...and ensuring consistency between them.

## Atomic Compartmentalization

Even counterparties to the same business-to-business Workflow typically must not have access to -- or even awareness of -- processes that they are not directly involved in.

## Workflow

lorem ipsum

## Step

lorem ipsum

## Task

lorem ipsum

## Workgroup

lorem ipsum

## CodeBook =&gt; Package

During the Radish34 project, the notion of a shared "codebook" was often discussed. This is ...

