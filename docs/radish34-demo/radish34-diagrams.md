# Radish34 Key Diagrams

Here are a few visualizations of how the Radish34 POC functions.

#### Representational Radish34 Workflow

The figure below depicts a representational workflow, for the process of creating an MSA \(Master Service Agreement\). Refer to the Radish34 Workflow explainer, for a detailed context of the process below. This process is chosen as it addresses key interactions of the Radish34 API \(built as a single tenant\) with the backend microservices: ZKP, and Messenger. In addition, this process also demonstrates all the system interactions \(functional view\) of a procurement process \(MSA\) that are designed and implemented in the overall stack.

Below is a summary of the MSA workflow broken down by steps, and each step can be represented as a sequence of tasks - defined as any process interaction that is from the API container to the other containers. Please note that, a few aspects of the diagram below are still in development \(particularly around the orchestration of the API services using a lightweight queue management library, "BullJS"\). In the current version,  only the interaction with the Messenger service is considered as a task, and efforts in the development branch depict our attempts to further modularize the key interactions, that could be modified or substituted with other custom plugins/modules. Throughout the process, any successful interaction is stored/logged on a mongo instance corresponding to each entity. There are 2 entities in this representation: Buyer \(sender\) and Supplier \(recipient\). Each entity is a separate instance of the following scale set of microservices: API, Messenger, DB \(Mongo and Redis\) per entity, and common microservices: UI and ZKP.

1. Buyer API executes methods to sign the MSA metadata under the babyjubjub scheme. This requires storage of the keys created for signing the MSA metadata, which is demonstrated to be managed locally on a development setup. From a practical standpoint, this is left to the best practices that are custom for each production setup and maintenance policies. The signed document, then is sent via the Messenger service to the supplier Radish34 instance from the buyer's instance. 
2. Upon receiving the MSA metadata, the Supplier API extracts the signed metadata obtained via Messenger \(and thereafter stored in the Supplier db instances\),  signs the metadata and sends back the "co-signed" document back to the buyer via Messenger \(and thereafter stored in the Buyer db instances\)
3. Buyer API then interacts ZKP service, to generate an offchain proof of execution of business logic: verify the signature of the supplier, and data validation checks on the terms of the MSA document, the volume tiering structure. This proof is then verified on chain, by invoking an RPC request to interact with the Shield and Verifier contracts deployed on chain. Buyer API communicates the successful verification \(transaction hash\), merkle leaf index \(indicating the position in the merkle tree in the Shield contract, where the hash of the MSA document is stored on chain\) to the Supplier via the Messenger service
4. Upon receiving the verification data from the Buyer, Supplier API could either run a confirmation check - either as extension to capture events emitted on chain during storage of hash in the merkle tree OR as an additional method to validate against data stored on the Supplier DB instance.  

![Radish34 Swimlane Diagram](../.gitbook/assets/image%20%283%29.png)

![Radish34 High-Level Component Diagram ](../.gitbook/assets/image%20%281%29.png)

![Radish34 Detailed Component Diagram \(Green Boxes are Reusable Components for Protocol\)](../.gitbook/assets/image.png)

## RFP Creation Workflow



| This page steps through the information flow during the creation of a new RFP. The \`Buyer's\` system is shown on the left in blue. The \`Supplier's\` system is shown on the right in green. |
| :--- |


## 

