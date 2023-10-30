# Key Diagrams

Here are a few visualizations of how the Radish34 POC functions.

### Representational Radish34 Workflow <a id="representational-radish34-workflow"></a>

The figure below depicts a representational workflow, for the process of creating an MSA \(Master Service Agreement\). Refer to the Radish34 Workflow explainer, for a detailed context of the process below. This process is chosen as it addresses key interactions of the Radish34 API \(built as a single tenant\) with the backend microservices: ZKP, and Messenger. In addition, this process also demonstrates all the system interactions \(functional view\) of a procurement process \(MSA\) that are designed and implemented in the overall stack.

Below is a summary of the MSA workflow broken down by steps, and each step can be represented as a sequence of tasks - defined as any process interaction that is from the API container to the other containers. Please note that, a few aspects of the diagram below are still in development \(particularly around the orchestration of the API services using a lightweight queue management library, "BullJS"\). In the current version, only the interaction with the Messenger service is considered as a task, and efforts in the development branch depict our attempts to further modularize the key interactions, that could be modified or substituted with other custom plugins/modules. Throughout the process, any successful interaction is stored/logged on a mongo instance corresponding to each entity. There are 2 entities in this representation: Buyer \(sender\) and Supplier \(recipient\). Each entity is a separate instance of the following scale set of microservices: API, Messenger, DB \(Mongo and Redis\) per entity, and common microservices: UI and ZKP.

1. Buyer API executes methods to sign the MSA metadata under the babyjubjub scheme. This requires storage of the keys created for signing the MSA metadata, which is demonstrated to be managed locally on a development setup. From a practical standpoint, this is left to the best practices that are custom for each production setup and maintenance policies. The signed document, then is sent via the Messenger service to the supplier Radish34 instance from the buyer's instance.
2. Upon receiving the MSA metadata, the Supplier API extracts the signed metadata obtained via Messenger \(and thereafter stored in the Supplier db instances\), signs the metadata and sends back the "co-signed" document back to the buyer via Messenger \(and thereafter stored in the Buyer db instances\)
3. Buyer API then interacts ZKP service, to generate an offchain proof of execution of business logic: verify the signature of the supplier, and data validation checks on the terms of the MSA document, the volume tiering structure. This proof is then verified on chain, by invoking an RPC request to interact with the Shield and Verifier contracts deployed on chain. Buyer API communicates the successful verification \(transaction hash\), merkle leaf index \(indicating the position in the merkle tree in the Shield contract, where the hash of the MSA document is stored on chain\) to the Supplier via the Messenger service
4. Upon receiving the verification data from the Buyer, Supplier API could either run a confirmation check - either as extension to capture events emitted on chain during storage of hash in the merkle tree OR as an additional method to validate against data stored on the Supplier DB instance.

![Radish34 MSA Workflow](https://gblobscdn.gitbook.com/assets%2F-M2ZgeO6_fLS5V_kJ073%2F-M2dJ4RIebxDTiCtVXzv%2F-M2dLtYG6QDphLzHNyJR%2Fimage.png?alt=media&token=e45346e4-f223-443b-9701-3027c4be16d2)

### Radish34 as an instantiation of Baseline <a id="radish34-as-an-instantiation-of-baseline"></a>

The figure below depicts Baseline as a set of microservices that are enabled using Baseline protocol. Radish34 is an instance of Baseline built for the procurement use case. Baseline has been formulated based on core design and product principles that are directional for Radish34 and any other customization of the Baseline protocol. Also shown is a sample instantiation of a hosted \(assumed Microsoft Azure Services\) application of a Baseline protocol.

![Baseline =&amp;gt; Radish34](https://gblobscdn.gitbook.com/assets%2F-M2ZgeO6_fLS5V_kJ073%2F-M2dJ4RIebxDTiCtVXzv%2F-M2dLbyPYQDMMqa_nWto%2Fimage.png?alt=media&token=ac1c7050-e9f1-4e6d-828d-d1568d5a1167)

### Radish34 Functional Architecture <a id="radish34-functional-architecture"></a>

The figure shows the various components of the Radish34 system. In line with the design and extensibility aspects set up in the Baseline protocol, the system architecture below also contains the components that can be replaced or modified for other similar use cases. Across the different services/integrations listed below, light green represents the components that can be replaced/modified and the darker ones represent the components that can be re-used for further customizations for similar use cases.

1. API: This microservice orchestrates the overall application management, and contains components that enable UI \(GraphQL\), blockchain, ZKP, messenger, and data integrations. In particular, API orchestration is also handled using queue management based approach.
2. Application Service: This represents the user facing or user interaction layer. Although the Radish34 demo shows a particular UI representation, this can be extended or integrated into external legacy data or application systems
3. Smart Contract Management Service: Radish34 smart contracts are managed and built as part of the deployment process. This could be customized as needed as part of an overall pipeline or can be handled on demand.
4. Zero Knowledge Service: Radish34 circuits represent the off-chain proofs/statements that are to be verified on chain. The service contains utilities for compiling circuits, generating keys for proof generation, generating proofs and verifier contracts
5. Messaging Service: Message communication is handled using Whisper, and the service also contains utilities for creating identities and pub/sub wrappers for handling message communication
6. Data Integration Service: This layer represents the different db components used in the Radish34 implementation to manage data across the storage instances \(Mongo DB\) and cache instances \(Redis DB\)

Additional integrations:

1. Custom wallet \(in the form of config files\) are leveraged by the API and Blockchain interaction components to transact on chain. The config files are loaded as part of the build process, and contain key metadata required for the overall application user configuration settings
2. Public mainnet integrations are handled through the API to in turn invoke RPC calls to the ethereum mainnet

![Radish34 Functional Component Architecture](https://gblobscdn.gitbook.com/assets%2F-M2ZgeO6_fLS5V_kJ073%2F-M2jg8-pxfDsVUWZmTC6%2F-M2jrCC1ivQ9MzTm1PQU%2FRadish34%20Components.png?alt=media&token=1de0b8a0-bdea-40f4-9b31-53e54862ee50)

​

## ​ <a id="undefined"></a>

