
![OASIS Logo](http://docs.oasis-open.org/templates/OASISLogo-v2.0.jpg)
-------

# Baseline API and Data Model Version 1.0

## Project Specification Draft 01

## 23 September 2020

<!-- URI list start (commented out except during publication by OASIS TC Admin)

#### This stage:
https://docs.oasis-open.org/baseline/baseline-api/v1.0/psd01/baseline-api-v1.0-psd01.md (Authoritative) \
https://docs.oasis-open.org/baseline/baseline-api/v1.0/psd01/baseline-api-v1.0-psd01.html \
https://docs.oasis-open.org/baseline/baseline-api/v1.0/psd01/baseline-api-v1.0-psd01.pdf

#### Previous stage:
N/A

#### Latest stage:
https://docs.oasis-open.org/baseline/baseline-api/v1.0/baseline-api-v1.0.md (Authoritative) \
https://docs.oasis-open.org/baseline/baseline-api/v1.0/baseline-api-v1.0.html \
https://docs.oasis-open.org/baseline/baseline-api/v1.0/baseline-api-v1.0.pdf

URI list end (commented out except during publication by OASIS TC Admin) -->

#### Open Project:
[Baseline, part of the Ethereum OASIS Open Project](https://www.baseline-protocol.org/)

#### Project Chair:
John Wolpert (john.wolpert@mesh.xyz), [ConsenSys](https://consensys.net/) 

#### Editors:
Anais Ofranc (aofranc@consianimis.com), [Consianimis](https://www.consianimis.com/) \
Andreas Freund (a.freundhaskel@gmail.com) \
Brian Chamberlain (brian.chamberlain@consensys.net), [ConsenSys](https://consensys.net/) \
Charles ‘Chaals’ Nevile (charles.nevile@consensys.net), [ConsenSys](https://entethalliance.org/) \
Daniel Norkin (daniel.norkin@envisionblockchain.com), [Envision Blockchain](https://envisionblockchain.com/)

<!--
#### Additional artifacts:
This prose specification is one component of a Work Product that also includes:
* XML schemas: (list file names or directory name)
* Other parts (list titles and/or file names)
* `(Note: Any normative computer language definitions that are part of the Work Product, such as XML instances, schemas and Java(TM) code, including fragments of such, must be (a) well formed and valid, (b) provided in separate plain text files, (c) referenced from the Work Product; and (d) where any definition in these separate files disagrees with the definition found in the specification, the definition in the separate file prevails. Remove this note before submitting for publication.)`
 -->

#### Related work:

<!--
This specification replaces or supersedes:
* _Baseline Protocol v0.1_ - https://github.com/ethereum-oasis/baseline/tree/master/**Example:**s/bri-1
* Specifications replaced by this specification (include hyperlink, preferably to HTML format)
 -->

This specification is related to: \
_Baseline Core Version 1.0_ - https://github.com/ethereum-oasis/baseline/tree/master/docs/specs/core

#### Abstract:

This document describes the Baseline programming interface and expected behaviors of all instances of this interface together with the required programming interface data model.

#### Status:
This document is under active development and implementers are advised against implementing the specification unless they are directly involved with the Baseline TC team.
Comments on this work can be provided by opening issues in the project repository or by sending email to the project’s public comment list baseline@lists.oasis-open-projects.org.

#### Key words:
The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "NOT RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in BCP 14 [[RFC2119](#rfc2119)] and [[RFC8174](#rfc8174)] when, and only when, they appear in all capitals, as shown here.

#### Citation format:
When referencing this specification the following citation format should be used:

**[baseline-api-v1.0]**

_Baseline API and Data Model Version 1.0_. Edited by X, Y, and Z. 23 September 2020. OASIS Project Specification Draft 01. https://docs.oasis-open.org/baseline/baseline-api/v1.0/psd01/baseline-api-v1.0-psd01.html. Latest stage: https://docs.oasis-open.org/baseline/baseline-api/v1.0/baseline-api-v1.0.html.

-------

## Notices
Copyright © OASIS Open 2020. All Rights Reserved.

Distributed under the terms of the OASIS [IPR Policy](https://www.oasis-open.org/policies-guidelines/ipr).

For complete copyright information please see the Notices section in the Appendix.

-------

# Table of Contents
[1 Introduction](#1-introduction) \
&nbsp;&nbsp;&nbsp;&nbsp;[1.1 Overview](#11-overview) \
&nbsp;&nbsp;&nbsp;&nbsp;[1.2 Glossary](#12-glossary) \
&nbsp;&nbsp;&nbsp;&nbsp;[1.3 Typographical Conventions](#13-typographical-conventions) \
[2 Design and Architecture](#2-design-and-architecture) \
[3 API](#3-api) \
&nbsp;&nbsp;&nbsp;&nbsp;[3.1 Org Management](#31-org-management) \
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[3.1.1 IRegistry](#311-iregistry) \
&nbsp;&nbsp;&nbsp;&nbsp;[3.2 Messaging](#32-messaging) \
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[3.2.1 IMessagingService](#321-imessagingservice) \
&nbsp;&nbsp;&nbsp;&nbsp;[3.3 Security](#33-security) \
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[3.3.1 IVault](#331-ivault) \
&nbsp;&nbsp;&nbsp;&nbsp;[3.4 Agreement Execution](#34-agreement-execution) \
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[3.4.1 IBaselineRPC](#341-ibaselinerpc) \
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[3.4.2 IBlockchainService](#342-iblockchainservice) \
&nbsp;&nbsp;&nbsp;&nbsp;[3.5 Privacy](#35-privacy) \
&nbsp;&nbsp;&nbsp;&nbsp;[3.6 Persistence](#36-persistence) \
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[3.6.1 IPersistenceService](#361-ipersistenceservice) \
&nbsp;&nbsp;&nbsp;&nbsp;[3.7 API Metadata](#37-api-metadata) \
[4 Data Model](#4-data-model) \
&nbsp;&nbsp;&nbsp;&nbsp;[4.1 Org Management](#41-org-management) \
&nbsp;&nbsp;&nbsp;&nbsp;[4.2 Messaging](#42-messaging) \
&nbsp;&nbsp;&nbsp;&nbsp;[4.3 Security](#43-security) \
&nbsp;&nbsp;&nbsp;&nbsp;[4.4 Agreement Execution](#44-agreement-execution) \
&nbsp;&nbsp;&nbsp;&nbsp;[4.5 Privacy](#45-privacy) \
&nbsp;&nbsp;&nbsp;&nbsp;[4.6 Persistence](#46-persistence) \
[5 Security Considerations](#6-security-considerations) \
[6 Conformance](#6-conformance) \
&nbsp;&nbsp;&nbsp;&nbsp;[9.1 API and Data Model Minimal Conformance Level]() \
&nbsp;&nbsp;&nbsp;&nbsp;[9.2 API and Data Model Conformance Level]()\
[Appendix A.        Acknowledgments]()\
[Appendix B.        Revision History]()

-------

# 1 Introduction

## 1.1 Overview


## 1.2 Glossary


**Party:** 

**Workgroup:** 


**Workflow:**

**Workstep:** 

**Baselining:** 


**Task:** 


**Lifecycle:** 

**Circuit Breaker:**

**Portability:**

**Interoperability:**


## 1.3 Typographical Conventions

- Naming conventions
- Font colors and styles
- Typographic conventions


-------

# 2 Design and Architecture

This section defines the key concepts and architectural principles of the API and Data model(s).


-------

# 3 API

## 3.1 Org Management

Describes interface(s) providing functions to manage workgroups, organizations and users.

### 3.1.1 IRegistry

This interface provides functions to manage workgroups, organizations and users. 

// workgroups

| Requirement ID | Requirement  | 
| :--- | :--- |
| REG1 | #createWorkgroup(params: object): Promise<any>;  <br>description:  <br>interface: <br>**Caveats:**  |
| REG2| #updateWorkgroup(workgroupId: string, params: object): Promise<any>; <br>description:  <br>interface: <br>**Caveats:** |
| REG3| #fetchWorkgroups(params: object): Promise<any>; <br>description:  <br>interface: <br>**Caveats:** |
| REG4| #fetchWorkgroupDetails(workgroupId: string): Promise<any>; <br>description:  <br>interface: <br>**Caveats:** |
| REG5| #fetchWorkgroupOrganizations(workgroupId: string, params: object): Promise<any>;<br>description:  <br>interface: <br>**Caveats:** |
| REG6| #createWorkgroupOrganization(workgroupId: string, params: object): Promise<any>; <br>description:  <br>interface: <br>**Caveats:** |
| REG7| #updateWorkgroupOrganization(workgroupId: string, organizationId: string, params: object): Promise<any>;<br>description:  <br>interface: <br>**Caveats:**  |
| REG8| #fetchWorkgroupInvitations(workgroupId: string, params: object): Promise<any>; <br>description:  <br>interface: <br>**Caveats:** |
| REG9| #fetchWorkgroupUsers(workgroupId: string, params: object): Promise<any>; <br>description:  <br>interface: <br>**Caveats:** |
| REG10| #createWorkgroupUser(workgroupId: string, params: object): Promise<any>; |
| REG11| #updateWorkgroupUser(workgroupId: string, userId: string, params: object): Promise<any>; <br>description:  <br>interface: <br>**Caveats:** |
| REG12| #deleteWorkgroupUser(workgroupId: string, userId: string): Promise<any>; <br>description:  <br>interface: <br>**Caveats:** |


// organizations

| Requirement ID | Requirement  | 
| :--- | :--- |
| REG13| createOrganization(params: object): Promise<any>; |
| REG14| fetchOrganizations(params: object): Promise<any>; |
| REG15| fetchOrganizationDetails(organizationId: string): Promise<any>;|
| REG16| updateOrganization(organizationId: string, params: object): Promise<any>;|


// organization users

| Requirement ID | Requirement  | 
| :--- | :--- |
| REG17| fetchOrganizationInvitations(organizationId: string, params: object): Promise<any>; |
| REG18| fetchOrganizationUsers(organizationId: string, params: object): Promise<any>; |
| REG19| inviteOrganizationUser(organizationId: string, params: object): Promise<any>;|



## 3.2 Messaging

Describes interface(s) providing functions to communicate with counterparties.

### 3.2.1 IMessagingService


## 3.3 Security

Describes interface(s) providing functions to manage vaults and keys and to handle digital signatures.

### 3.3.1 IVault

This interface provides functions to manage vaults and keys.

| Requirement ID | Requirement  | 
| :--- | :--- |
| VAULT1 | createVault(params: object): Promise<any>;  |
| VAULT2| fetchVaults(params: object): Promise<any>;  |
| VAULT3| fetchVaultKeys(vaultId: string, params: object): Promise<any>;|
| VAULT4| createVaultKey(vaultId: string, params: object): Promise<any>; |
| VAULT5| deleteVaultKey(vaultId: string, keyId: string): Promise<any>;|
| VAULT6| encrypt(vaultId: string, keyId: string, payload: string): Promise<any>; |
| VAULT7| decrypt(vaultId: string, keyId: string, payload: string): Promise<any>; |
| VAULT8| signMessage(vaultId: string, keyId: string, msg: string): Promise<any>; |
| VAULT9| verifySignature(vaultId: string, keyId: string, msg: string, sig: string): Promise<any>; |
| VAULT10| fetchVaultSecrets(vaultId: string, params: object): Promise<any>; |
| VAULT11| createVaultSecret(vaultId: string, params: object): Promise<any>; |
| VAULT12| deleteVaultSecret(vaultId: string, secretId: string): Promise<any>; |

## 3.4 Agreement Execution



### 3.4.1 IBaselineRPC

Contains RPC methods that are Remote Calls available by default. The solution ??MUST?? implement all those methods.


| Requirement ID | Requirement  | 
| :--- | :--- |
| BRPC1|**# track**<br>**Description:**  Initializes a merkle tree database for the given Shield contract address and starts tracking new tree events.<br>**jsonrpc:** baseline_track <br>**Caveats:** <br>**Parameters:** <br> - DATA - address of the Shield contract<br>**Returns:**: -<br>**Example:**:|
| BRPC2|**# untrack**<br>**Description:** Removes event listeners for a single Shield contract. <br>**jsonrpc:** baseline_untrack <br>**Caveats:** <br>**Parameters:** <br> - DATA - address of the Shield contract<br>**Returns:**: -<br>**Example:**:|
| BRPC3|**# getTracked**<br>**Description:**  Retrieves a list of the shield contract addresses being tracked and persisted. <br>**jsonrpc:** baseline_getTracked <br>**Caveats:** <br>**Parameters:** -<br>**Returns:**: <br> - Array&lt;DATA&gt; - list of all tracked Shield contracts<br>**Example:**:|
| BRPC4| **# getLeaf** <br>**Description:** Retrieves a single leaf from a tree at the given shield contract address.  <br>**jsonrpc:** baseline_getLeaf <br>**Caveats:**  only works if the contract is tracked, otherwise <br>**Returns:** an error<br>**Parameters:** <br> - DATA - Shield contract address<br> - QUANTITY - leaf index<br>**Returns:**:<br> - MERKLE_TRIE_NODE<br>**Example:**:|
| BRPC5| **# insertLeaf** <br>**Description:** Inserts a single leaf to atree at the given shield contract address.  <br>**jsonrpc:** baseline_insertLeaf <br>**Caveats:**  only works if the contract is tracked, otherwise <br>**Returns:** an error<br>**Parameters:** <br> - DATA - Shield contract address<br> - QUANTITY - leaf index<br>**Returns:**:<br> - MERKLE_TRIE_NODE<br>**Example:**:|
| BRPC6| **# getLeaves** <br>**Description:**  Retrieves multiple leaves from a tree at the given shield contract address. <br>**jsonrpc:** baseline_getLeaves <br>**Caveats:** only works if the contract is tracked, otherwise <br>**Returns:** an error<br>**Parameters:** <br> - DATA - Shield contract address<br> - Array&lt;QUANTITY&gt; - leaf indexes<br>**Returns:**:<br> - Array&lt;MERKLE_TRIE_NODE&gt;<br>**Example:**:|
| BRPC7| **# getRoot** <br>**Description:**  Retrieves the root of a tree at the given shield contract address .<br>**jsonrpc:** baseline_getRoot <br>**Caveats:**  only works if the contract is tracked, otherwise <br>**Returns:** an error<br>**Parameters:**<br> - DATA - Shield contract address<br>**Returns:**:<br> - MERKLE_TRIE_NODE<br>**Example:**:|
| BRPC8| **# getCount** <br>**Description:**  Gets count of a tree at the given 'address'.<br>**jsonrpc:** baseline_getRoot <br>**Caveats:**  only works if the contract is tracked, otherwise <br>**Returns:** an error<br>**Parameters:**<br> - DATA - Shield contract address<br>**Returns:**:<br> - MERKLE_TRIE_NODE<br>**Example:**:|
| BRPC9|**# getSiblings** <br>**Description:**  Retrieves siblings path/proof of the given leaf index. <br>**jsonrpc:** baseline_getSiblings <br>**Caveats:**  only works if the contract is tracked, otherwise<br> **Returns:** an error<br>**Parameters:**<br> - DATA - address of the Shield contract<br> - QUANTITY - leaf index to prove<br>**Returns:**:<br> - Array&lt;MERKLE_TRIE_NODE&gt; - siblings path<br>**Example:**:|
| BRPC10|**# verify** <br>**Description:**  Verifies a sibling path for a given root and leaf at the given shield contract address. .<br>**jsonrpc:** baseline_verify <br>**Caveats:** only works if the contract is tracked, otherwise <br>**Returns:** an error<br>**Parameters:**<br> - DATA - address of the Shield contract<br> - DATA - root node hash<br> - DATA - hash of the leaf node to be verified<br> - Array&lt;DATA&gt; - siblings path/proof<br>**Returns:**:<br> - bool - verification result<br>**Example:**:| 
| BRPC11|**# verifyAndPush**<br>**Description:** .<br>**jsonrpc:** baseline_verify <br>**Caveats:** generates and sends a transaction which only affects the state after being included in a block<br>**Parameters:**<br>- DATA - address of the transaction sender<br>- DATA - address of the Shield contract<br>- Array&lt;DATA&gt; - proof data<br> - Array&lt;DATA&gt; - public inputs<br> - DATA - commitment<br>**Returns:**:<br> - DATA - transaction hash<br>**Example:**:| 
| BRPC12 | **# deploy** <br>**Description:** Deploys a contract with the given 'contract type'. Requires the account to be unlocked. <br>**jsonrpc:** baseline_deploy <br>**Caveats:** Optional and only used for dev/testing<br>**Parameters:**<br> - DATA - address of the deploying transaction sender<br> - string - type of the contract to be deployed<br>**Returns:**: -<br>**Example:**:|
| BRPC13 | **# deployBytecode** <br>**Description:**  Deploys a contract with the given bytecode. Requires the account to be unlocked. <br>**jsonrpc:** baseline_deployBytecode <br>**Caveats:** Optional and only used for dev/testing<br>**Parameters:**<br> - DATA - address of the deploying transaction sender<br> - string - type of the contract to be deployed<br>**Returns:**: -<br>**Example:**:|

### 3.4.2 IBlockchainService 



## 3.5 Privacy

Describes interfaces(s) providing functions to implement and manage private transactions.\
IZKSnarkCircuitProvider\
IZKSnarkCompilationArtifacts

## 3.6 Persistence

Describes interface(s) providing functions to store, query and update data.(sub and unsub ?)\
### 3.6.1 IPersistenceService

## 3.7 API Metadata

Describes the object providing metadata information about the API (example: title, description, terms of service, contact, license,version)

-------

# 4 Data Model

## 4.1 Org Management

| Requirement ID | Requirement  | 
| :--- | :--- |
| ORGM1|**#Workgroup**<br>**id:**  <br>**createdAt:**  <br>**networkId:** <br>**userId:** <br> **name**: <br>**description:**<br>**type:**<br>**config:**<br>**hidden:**|
| ORGM2|**#Organization**<br> {id, createdAt, name, userId, description, metadata}|
| ORGM3|**#User**<br>{id, createdAt, name, firstName, lastName, email, permissions}\|
| ORGM4|**#orgRegistry**<br>|

## 4.1.1 Examples

### 4.1.1.1 Workgroup 



```
Workgroup {
  id: '5bb63fd0-27f8-43f5-8275-14fe2891f14e',
  createdAt: '2020-11-05T14:34:04.3478365Z',
  networkId: '66d44f30-9092-4182-a3c4-bc02736d6ae5',
  userId: 'e021eca9-17cc-4598-a513-c84b05c15270',
  name: 'baseline workgroup',
  description: null,
  type: null,
  config: {
    webhook_secret: 'd6bf3a9f92344ea9b5ee29bd164060a9'
  },
  hidden: false
}
```



### 4.1.1.2  Organization



```
Organization {
  id: '440988f7-8f24-4dd8-bea0-8f103caa2fd5',
  createdAt: '2020-11-05T14:35:26.4838047Z',
  name: 'Bob Corp',
  userId: 'e021eca9-17cc-4598-a513-c84b05c15270',
  description: null,
  metadata: { messaging_endpoint: 'nats://localhost:4224' }
}


```



## 4.2.3 User


```
User {
  id: '',

}
```




## 4.2.4 orgRegistry


## 4.2 Messaging

## 4.2.1 Examples

```
export enum Opcode {
  Baseline = 'BLINE', // workflow-specific
  Join = 'JOIN', // join workgroup
  Ping = 'PING',
  Pong = 'PONG',
  Proof = 'PROOF', // generate proof
  Verify = 'VRFY', // idempotent proof verification
}export enum PayloadType {
  Binary = 0x0,
  Text = 0x1,
}export type Message = {
  opcode: Opcode; // up to 40 bits
  sender: string, // up to 336 bits
  recipient: string; // up to 336 bits
  shield: string; // up to 336 bits
  identifier: string; // up to 288 bits (i.e., UUIDv4 circuit/workflow identifier)
  signature: string; // 512 bits
  type: PayloadType; // 1 bit
  payload: Buffer; // arbitrary length
}

```

## 4.3 Security

| Requirement ID | Requirement  | 
| :--- | :--- |
| SEC1|**#Vault**<br>{id, createAt, name, description}|
| SEC2|**#Key**<br> {id, createAt, vaultId, type, usage, spec, name, description, publicKey}|


Identity/authentication/authorization\
Cryptography - curves, hash functions\
audit

## 4.3.1 Examples
```
Vault {
  id: 'f04e7222-bc86-47a4-a960-3be7e0a06995',
  createdAt: '2020-11-05T14:39:35.088114Z',
  name: 'Alice Corp vault',
  description: 'default organizational keystore'
}

Key {
  id: '89c32eea-d522-4780-84bc-7c29de9f5cf1',
  createdAt: '2020-11-05T14:39:37.7093941Z',
  vaultId: 'f04e7222-bc86-47a4-a960-3be7e0a06995',
  type: 'asymmetric',
  usage: 'sign/verify',
  spec: 'secp256k1',
  name: 'Alice Corp secp256k1 keypair',
  description: 'Alice Corp secp256k1 keypair',
  address: '0x5AE7032d4E3eC2215474988e9831D45C793b2A0f',
  publicKey: '0x049bd97593e08d40d77426d73a1f5ce2dbd184f58e48bee417577dcefcb6eab736dd06128a1eba69695af700bb1fcc5f0baa5e00ef597ebf2a0e2aaf2f8099c73c'
}

```


## 4.4 Agreement Execution

Workflow {}\
Worstep {}


## 4.5 Privacy

## 4.6 Persistence



-------

# 5 Security Considerations



-------

# 6 Conformance



-------

# Appendix A. References

This appendix contains the normative and informative references that are used in this document. Any normative work cited in the body of the text as needed to implement the work product must be listed in the Normative References section below. Each reference to a separate document or artifact in this work must be listed here and must be identified as either a Normative or an Informative Reference. Normative references are specific (identified by date of publication and/or edition number or version number) and Informative references are either specific or non-specific.

While any hyperlinks included in this appendix were valid at the time of publication, OASIS cannot guarantee their long-term validity.

(Note - Reference sources:

For references to IETF RFCs, use the approved citation formats at:  
http://docs.oasis-open.org/templates/ietf-rfc-list/ietf-rfc-list.html.

For references to W3C Recommendations, use the approved citation formats at:  
http://docs.oasis-open.org/templates/w3c-recommendations-list/w3c-recommendations-list.html.

Remove this note before submitting for publication.)


## A.1 Normative References

The following documents are referenced in such a way that some or all of their content constitutes requirements of this document.



-------

# Appendix B. ABC

-------

# Appendix C. Acknowledgments


## C.1 Special Thanks

<!-- This is an optional subsection to call out contributions from OP members. If a OP wants to thank non-OP members then they should avoid using the term "contribution" and instead thank them for their "expertise" or "assistance". -->

Substantial contributions to this document from the following individuals are gratefully acknowledged:

Participant Name, Affiliation or "Individual Member"

## C.2 Participants

<!-- An OP can determine who they list here. It is common practice for OPs to list everyone that was part of the OP during the creation of the document, but this is ultimately an OP decision on who they want to list and not list. -->

The following individuals have participated in the creation of this specification and are gratefully acknowledged:

**Project-name OP Members:**

| First Name | Last Name | Company |
| :--- | :--- | :--- |
x | x| Something Networks
x | x | Company B
x | x | Mini Micro
x | x | Big Networks

-------

# Appendix D. Revision History

Revisions made since the initial stage of this numbered Version of this document may be tracked here.

If revision tracking is handled in another system like github, provide a link to it instead of using this table, if desired.

| Revision | Date | Editor | Changes Made |
| :--- | :--- | :--- | :--- |
| baseline-api-v1.0-psd01 | yyyy-mm-dd | Editor Name | Initial working draft |


-------

# Appendix F. Notices

<!-- This required section should not be altered, except to modify the license information in the second paragraph -->


Copyright © OASIS Open 2020. All Rights Reserved.

All capitalized terms in the following text have the meanings assigned to them in the OASIS Intellectual Property Rights Policy (the "OASIS IPR Policy"). The full [Policy](https://www.oasis-open.org/policies-guidelines/ipr) may be found at the OASIS website.

This specification is published under the [CC0 1.0 Universal (CC0 1.0)](http://creativecommons.org/publicdomain/zero/1.0/) license. Portions of this specification are also provided under the [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0).

All contributions made to this project have been made under the [OASIS Contributor License Agreement (CLA)](https://www.oasis-open.org/policies-guidelines/open-projects-process#individual-cla-exhibit).

For information on whether any patents have been disclosed that may be essential to implementing this specification, and any offers of patent licensing terms, please refer to the [Open Projects IPR Statements](https://github.com/oasis-open-projects/administration/blob/master/IPR_STATEMENTS.md) page.

This document and translations of it may be copied and furnished to others, and derivative works that comment on or otherwise explain it or assist in its implementation may be prepared, copied, published, and distributed, in whole or in part, without restriction of any kind, provided that the above copyright notice and this section are included on all such copies and derivative works. However, this document itself may not be modified in any way, including by removing the copyright notice or references to OASIS, except as needed for the purpose of developing any document or deliverable produced by an OASIS Open Project (in which case the rules applicable to copyrights, as set forth in the OASIS IPR Policy, must be followed) or as required to translate it into languages other than English.

The limited permissions granted above are perpetual and will not be revoked by OASIS or its successors or assigns.

This document and the information contained herein is provided on an "AS IS" basis and OASIS DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO ANY WARRANTY THAT THE USE OF THE INFORMATION HEREIN WILL NOT INFRINGE ANY OWNERSHIP RIGHTS OR ANY IMPLIED WARRANTIES OF MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE. OASIS AND ITS MEMBERS WILL NOT BE LIABLE FOR ANY DIRECT, INDIRECT, SPECIAL OR CONSEQUENTIAL DAMAGES ARISING OUT OF ANY USE OF THIS DOCUMENT OR ANY PART THEREOF.

As stated in the OASIS IPR Policy, the following three paragraphs in brackets apply to OASIS Standards Final Deliverable documents (Project Specifications, OASIS Standards, or Approved Errata).

\[OASIS requests that any OASIS Party or any other party that believes it has patent claims that would necessarily be infringed by implementations of this OASIS Standards Final Deliverable, to notify OASIS TC Administrator and provide an indication of its willingness to grant patent licenses to such patent claims in a manner consistent with the IPR Mode of the OASIS Open Project that produced this deliverable.\]

\[OASIS invites any party to contact the OASIS TC Administrator if it is aware of a claim of ownership of any patent claims that would necessarily be infringed by implementations of this OASIS Standards Final Deliverable by a patent holder that is not willing to provide a license to such patent claims in a manner consistent with the IPR Mode of the OASIS Open Project that produced this OASIS Standards Final Deliverable. OASIS may include such claims on its website, but disclaims any obligation to do so.\]

\[OASIS takes no position regarding the validity or scope of any intellectual property or other rights that might be claimed to pertain to the implementation or use of the technology described in this OASIS Standards Final Deliverable or the extent to which any license under such rights might or might not be available; neither does it represent that it has made any effort to identify any such rights. Information on OASIS' procedures with respect to rights in any document or deliverable produced by an OASIS Open Project can be found on the OASIS website. Copies of claims of rights made available for publication and any assurances of licenses to be made available, or the result of an attempt made to obtain a general license or permission for the use of such proprietary rights by implementers or users of this OASIS Standards Final Deliverable, can be obtained from the OASIS TC Administrator. OASIS makes no representation that any information or list of intellectual property rights will at any time be complete, or that any claims in such list are, in fact, Essential Claims.\]

The name "OASIS" is a trademark of [OASIS](https://www.oasis-open.org/), the owner and developer of this specification, and should be used only to refer to the organization and its official outputs. OASIS welcomes reference to, and implementation and use of, specifications, while reserving the right to enforce its marks against misleading uses. Please see https://www.oasis-open.org/policies-guidelines/trademark for above guidance.
