---
description: Describe how we are going to move from the demo code to the protocol code
---

# From POC to Protocol

## Abstraction

Even if Radish34 were the only application we wanted to build, the code still requires abstraction. For example, the components that provide the MSA step in the Radish34 Workflow is named MSA and tailored specifically to that Workflow Step. Even without a generalized protocol, this reusable package should be defined one abstraction up as "Step" or "Task" and then instantiated for each instance: RFP, Bid, MSA, PO, Shipment, Invoice, etc.

## Generalization

## Currently observed performance metrics

MSA Takes x minutes, costs this much.....

