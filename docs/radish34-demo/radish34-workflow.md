# Radish34 Workflow





![](../.gitbook/assets/r34-queue-based-workflow-design-rfp-to-msa-flow.jpg)







| Domain model of the Radish Baseline implementation |
| :--- |


## Business and Supporting Objects

### Supply Chain Objects

These context specific top level business objects such as RFP, MSA Contract, P.O. and Invoice are loosely coupled and only contain external reference to other objects in the previous process flow. This is because it is possible to create any of these on their own \(technically speaking\) depending on the Organizations role and/or phase of interaction with other organizations in the Radish network. However, the application process management logic will re-enforce the proper creation order. It is expected that these objects cross system boundaries and also have on-chain representation. These objects are prominent in the User Interface and the end user can interact with them.

![](../.gitbook/assets/revised-radish-user-stories-business-objects-1.png)

### Generic Business Objects

These object are supporting generic business contexts and the usage of the Radish system in an organization. They are required to run the Radish system but any on-chain identity is managed externally to the object \(internally to the local system\). These objects do NOT cross system boundaries and \(other than account/identity used for messaging or onchain transactions\) do not have on-chain representation. These objects are likely reflected in the UI and the end user can interact with them, though potentially under different labels \(eg User object is managed under "Account"\).

### Technology Specific Objects

These objects are specific to the technology implementation. They encapsulate the delivery of objects, messages, data identity, etc... and help ensure reliability of the system as a whole and durability of the data. These objects are not indented to be used/interacted with by end-users \(but could be for diagnostic purposes\).

![](../.gitbook/assets/revised-radish-user-stories-business-objects-2.png)

### Deployment/Configuration Objects

These support the direct operation of the Radish system as it is installed for a specific environment/deployment in an organizations data center/cloud. Cryptographic keys are stored separately from configuration to support separate access controls and key rotation. These objects need not be managed in an RDMS or storage system, but in the case of the cryptographic keys should be stored in a HSM based vault of some kind.

![](../.gitbook/assets/revised-radish-user-stories-business-objects-3.png)





