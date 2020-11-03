
![OASIS Logo](http://docs.oasis-open.org/templates/OASISLogo-v2.0.jpg)
-------

# Baseline Core Version 1.0

## Project Specification Working Draft

## 29 September 2020

<!-- URI list start (commented out except during publication by OASIS TC Admin)

#### This stage:
https://docs.oasis-open.org/baseline/baseline-core/v1.0/psd01/baseline-core-v1.0-psd01.md (Authoritative) \
https://docs.oasis-open.org/baseline/baseline-core/v1.0/psd01/baseline-core-v1.0-psd01.html \
https://docs.oasis-open.org/baseline/baseline-core/v1.0/psd01/baseline-core-v1.0-psd01.pdf

#### Previous stage:
N/A

#### Latest stage:
https://docs.oasis-open.org/baseline/baseline-core/v1.0/baseline-core-v1.0.md (Authoritative) \
https://docs.oasis-open.org/baseline/baseline-core/v1.0/baseline-core-v1.0.html \
https://docs.oasis-open.org/baseline/baseline-core/v1.0/baseline-core-v1.0.pdf

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
* _Baseline Protocol Version 1.0_ - 
* Specifications replaced by this specification (include hyperlink, preferably to HTML format)
 -->

This specification is related to: \
_Baseline API and Data Model version 1.0_ - https://github.com/ethereum-oasis/baseline/tree/master/docs/specs/api


#### Abstract:
This document describes the minimal set of business and technical prerequisites, functional and non-functional requirements, together with a reference architecture that when implemented ensures that two or more systems of record can synchronize their system state over a permissionless public Distributed Ledger Technology (DLT) network.

#### Status:
This document is under active development and implementers are advised against implementing the specification unless they are directly involved with the Baseline TC team.

<!--
was last revised or approved by Baseline, part of the Ethereum OASIS Open Project, on the above date. The level of approval is also listed above. Check the "Latest stage" location noted above for possible later revisions of this document. Any other numbered Versions and other technical work produced by the Open Project (OP) are listed at [TBD].
-->

Comments on this work can be provided by opening issues in the project repository or by sending email to the project’s public comment list baseline@lists.oasis-open-projects.org.


#### Key words:
The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "NOT RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in BCP 14 [[RFC2119](#rfc2119)] and [[RFC8174](#rfc8174)] when, and only when, they appear in all capitals, as shown here.

#### Citation format:
When referencing this specification the following citation format should be used:

**[baseline-core-v1.0]**

_Baseline Core Version 1.0_. Edited by Anais Ofranc. 29 September 2020. OASIS Project Specification Draft 01. https://docs.oasis-open.org/baseline/baseline-core/v1.0/psd01/baseline-core-v1.0-psd01.html. Latest stage: https://docs.oasis-open.org/baseline/baseline-core/v1.0/baseline-core-v1.0.html.

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
[3 API and Data Model](#3-api-and-data-model) \
[4 Communication](#4-communication) \
&nbsp;&nbsp;&nbsp;&nbsp;[4.1 Authentication and Authorization](#41-authentication-and-authorization) \
&nbsp;&nbsp;&nbsp;&nbsp;[4.2 Message Delivery](#42-message-delivery) \
&nbsp;&nbsp;&nbsp;&nbsp;[4.3 Performance](#43-performance) \
[5  Privacy and Confidentiality](#5-privacy-and-confidentiality) \
&nbsp;&nbsp;&nbsp;&nbsp;[5.1 Privacy](#51-privacy) \
&nbsp;&nbsp;&nbsp;&nbsp;[5.2 Confidentiality](#52-confidentiality) \
[6 Agreement Execution](#6-agreement-execution)  \
&nbsp;&nbsp;&nbsp;&nbsp;[6.1 Business Logic Development](#61-business-logic-development) \
&nbsp;&nbsp;&nbsp;&nbsp;[6.2 Business Logic Execution](#62-business-logic-execution) \
&nbsp;&nbsp;&nbsp;&nbsp;[6.3 Performance](#63-performance) \
[7 Governance](#7-governance) \
&nbsp;&nbsp;&nbsp;&nbsp;[7.1 Governance Model](#71-governance-model) \
[8 Security Considerations](#8-security-considerations) \
&nbsp;&nbsp;&nbsp;&nbsp;[8.1 Data Privacy](#81-data-privacy) \
&nbsp;&nbsp;&nbsp;&nbsp;[8.2 Production readiness](#82-production-readiness) \
[9 Conformance](#9-conformance) \
&nbsp;&nbsp;&nbsp;&nbsp;[9.1 Conformance Targets](#91-conformance-targets) \
&nbsp;&nbsp;&nbsp;&nbsp;[9.2 Conformance Levels](#92-conformances-levels)\
&nbsp;&nbsp;&nbsp;&nbsp;[9.3 Interoperability](#93-interoperability)\
[Appendix A.        Acknowledgments]()\
[Appendix B.        Revision History]()

 

-------

# 1 Introduction


## 1.1 Overview


## 1.2 Glossary

- Definitions of terms
- Acronyms and abbreviations

## 1.3 Typographical Conventions

- Naming conventions
- Font colors and styles
- Typographic conventions


-------

# 2 Design and Architecture


-------

# 3 API and Data Model


-------

# 4 Communication

This section describes the logical architecture (presented as two abstract services - Authentication & Authorization and Message Delivery) that allows parties to send and receive messages securely.

## 4.1 Authentication and Authorization

Describes the requirements for the Authentication service responsible for establishing and maintaining the connection between verified parties.

| Requirement ID | Requirement  | 
| :--- | :--- |
| COM1 | something MUST something |
| COM2 | something SHOULD something |

## 4.2 Message Delivery

Describes the requirements for the Delivery service responsible for exchanging messages between verified parties.

| Requirement ID|Requirement  |
| :--- | :--- |
| COM3 | MUST implement IMessagingService interface to interact with verified parties. |
| COM4 | MUST implement pub-sub pattern. |
| COM5 | MUST implement XYZ Protocol Messages (types, formats, queues, inbound, outbound). |
| COM6 | Automated message validation |
| COM7 | Messaging Endpoints - SHOULD be distinct from system of record. |

## 4.3 Performance

Describes the performance requirements for the Communication component.

| Requirement ID|Requirement  |
| :--- | :--- |
| COM8 | Durable messaging  |
| COM9 | Persistent messaging|
| COM10 | Latency  |
| COM11 | Fault-tolerance |
| COM12 | Scalability |


-------

# 5 Privacy and Confidentiality

This section describes mechanisms to ensure counterparties confidentiality and shielded private transactions.

## 5.1 Privacy
Describes mechanisms ensuring that only information relevant to the transaction and pre-agreed by verified parties is used to its purpose.

| Requirement ID|Requirement  |
| :--- | :--- |
| PRICON1 | something MUST something  |
| PRICON2 | something SHOULD something |


## 5.2 Confidentiality

Describes the mechanisms ensuring that other parties (i.e parties outside of transaction) are prevented from accessing data that they are not authorized to access.

| Requirement ID|Requirement  |
| :--- | :--- |
| PRICON3 | something MUST something  |
| PRICON4 | something SHOULD something |

-------

# 6 Agreement Execution

## 6.1 Business Logic Development

Describes the requirements for the development of business rules that define what and how workflows are executed.

| Requirement ID|Requirement  |
| :--- | :--- |
| AGEXEC1 | IBaselineRPC  |
| AGEXEC2| Shared agreement: up to each workgroup to agree on business logic  |
| AGEXEC3| Shielding: up up to each workgroup to determine a suitable shielding mechanism. |

## 6.2 Business Logic Execution

Describes the mechanisms supporting the execution of the agreed business logic.


| Requirement ID|Requirement  |
| :--- | :--- |
| AGEXEC4 | Workflows, worksteps - business rules chaining and sequenced execution |
| AGEXEC5| Deterministic result - given a set of arguments and a state of the ledger, execution of business logic must produce the same result. |
| AGEXEC6| Event-driven |
| AGEXEC7| On-chain/ DTL execution mode|

## 6.3 Performance

Describes the performance requirements for the Agreement Execution component.

| Requirement ID|Requirement  |
| :--- | :--- |
| AGEXEC8 | Processing/Finality time  |
| AGEXEC9| Execution/Process monitoring |

-------

# 7 Governance
Describes the required functionalities to implement governance processes at every functional layer of the Baseline specification.


## 7.1 Governance Model

| Requirement ID|Requirement  |
| :--- | :--- |
| GOV1 | Change Control - requirements for introducing change in a controlled and coordinated manner for each functional layer. |
| GOV2| Execution/Process monitoring |


## 7.2 Audit

Describes the requirements for audit activities. 


| Requirement ID|Requirement  |
| :--- | :--- |
| GOV3 |Internal audit |
| GOV4| External audit  |


## 7.3 Monitoring & Reporting

Describes the requirements for monitoring and reporting on operations for each functional layer.

| Requirement ID|Requirement  |
| :--- | :--- |
| GOV5 | something MUST something  |
| GOV6| something SHOULD something |

-------

# 8 Security Considerations


Describes security topics that should be important in Baseline implementations but that are NOT requirements. 

## 8.1 Data Privacy

Provides a list of considerations related to data privacy.

The standard does not set any requirements for compliance to jurisdiction legislation/regulations, responsibility of the implementer to comply to applicable data privacy laws.

## 8.2 Production Readiness

Provides a list of considerations related to the use of underlying protocols/applications/tools etc. 

The standard does not set any requirements for the use of specific applications/tools/libraries etc.
Examples included in standard to be non-normative.
The implementer should perform due diligence when selecting tools, libraries etc.



<!--

(Note: OASIS strongly recommends that Open Projects consider issues that might affect safety, security, privacy, and/or data protection in implementations of their specification and document them for implementers and adopters. For some purposes, you may find it required, e.g. if you apply for IANA registration.

While it may not be immediately obvious how your specification might make systems vulnerable to attack, most specifications, because they involve communications between systems, message formats, or system settings, open potential channels for exploit. For example, IETF [[RFC3552](#rfc3552)] lists “eavesdropping, replay, message insertion, deletion, modification, and man-in-the-middle” as well as potential denial of service attacks as threats that must be considered and, if appropriate, addressed in IETF RFCs.

In addition to considering and describing foreseeable risks, this section should include guidance on how implementers and adopters can protect against these risks.

We encourage editors and OP members concerned with this subject to read _Guidelines for Writing RFC Text on Security Considerations_, IETF [[RFC3552](#rfc3552)], for more information.

-->

-------

# 9 Conformance


Describes the conformance clauses and tests required to achieve baseline compliant implementations.

## 9.1 Conformance Targets

Defines entities and implementations subject to conformance.


## 9.2 Conformance Levels

Defines conformance levels and their conformance clauses.

## 9.3 Interoperability

<!--

(Note: The [OASIS TC Process](https://www.oasis-open.org/policies-guidelines/tc-process#wpComponentsConfClause) requires that a specification approved by the OP for public review, or for publication at the Project Specification or OASIS Standard level must include a separate section, listing a set of numbered conformance clauses, to which any implementation of the specification must adhere in order to claim conformance to the specification (or any optional portion thereof). This is done by listing the conformance clauses here.

For the definition of "conformance clause," see [OASIS Defined Terms](https://www.oasis-open.org/policies-guidelines/oasis-defined-terms-2017-05-26#dConformanceClause).

See "Guidelines to Writing Conformance Clauses":  
http://docs.oasis-open.org/templates/TCHandbook/ConformanceGuidelines.html.

Remove this note before submitting for publication.)

-->

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
<!-- 
###### [OpenC2-HTTPS-v1.0]
_Specification for Transfer of OpenC2 Messages via HTTPS Version 1.0_. Edited by David Lemire. Latest stage: http://docs.oasis-open.org/openc2/open-impl-https/v1.0/open-impl-https-v1.0.html
###### [OpenC2-SLPF-v1.0]
_Open Command and Control (OpenC2) Profile for Stateless Packet Filtering Version 1.0_. Edited by Joe Brule, Duncan Sparrell, and Alex Everett. Latest stage: http://docs.oasis-open.org/openc2/oc2slpf/v1.0/oc2slpf-v1.0.html
###### [RFC2119]
Bradner, S., "Key words for use in RFCs to Indicate Requirement Levels", BCP 14, RFC 2119, DOI 10.17487/RFC2119, March 1997, http://www.rfc-editor.org/info/rfc2119.
###### [RFC8174]
Leiba, B., "Ambiguity of Uppercase vs Lowercase in RFC 2119 Key Words", BCP 14, RFC 8174, DOI 10.17487/RFC8174, May 2017, http://www.rfc-editor.org/info/rfc8174. 
-->

## A.2 Informative References
<!-- 
###### [RFC3552]
Rescorla, E. and B. Korver, "Guidelines for Writing RFC Text on Security Considerations", BCP 72, RFC 3552, DOI 10.17487/RFC3552, July 2003, https://www.rfc-editor.org/info/rfc3552.
-->
-------

# Appendix B. ABC


-------

# Appendix C. Acknowledgments
<!--
`(Note: A Work Product approved by the OP should include a list of people who participated in the development of the Work Product. This is generally done by collecting the list of names in this appendix. This list should be initially compiled by the Chair, and any Member of the OP may add or remove their names from the list by request. Remove this note before submitting for publication.)`
-->
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
x | x | Something Networks
x | x | Company B
x | x | Mini Micro
x | x | Big Networks

-------

# Appendix D. Revision History

Revisions made since the initial stage of this numbered Version of this document may be tracked here.

If revision tracking is handled in another system like github, provide a link to it instead of using this table, if desired.

| Revision | Date | Editor | Changes Made |
| :--- | :--- | :--- | :--- |
| baseline-core-v1.0-psd01 | 2020-09-29 | Anais Ofranc | Initial working draft |

-------
<!--
# Appendix E. Example Appendix with subsections

## E.1 Subsection title

### E.1.1 Sub-subsection
-->
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
