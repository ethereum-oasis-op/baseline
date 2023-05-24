# Use of ZKP, CCSM Anchoring, and Verifiable Credentials to Create a Trustless Supply Chain. 

## Summary

This document contains research derived from the BLIP-1 and BLIP-14 efforts. These research efforts focus on determining when the use of zero knowledge proofs and anchoring state changes on a CCSM are appropriate for multi-party workflow steps. The resources listed below outline a multi-party international supply chain use case and the business & technical requirements that provide the frame for this analysis. Additionally, the requirements outlined in the documentation provided provide a foundation for which an international supply chain demo application can be implemented. 

These resources illustrate how supply chain documents (state objects) can be:
* exchanged in zero trust and under zero knowledge,
* synchronized across multiple parties,
* and verified by third parties to be correct. 

Technical elements highlighted in the following resources are:
* The use of Verifiable Credentials as state objects representing Supply Chain Documents.
* The need for CCSM's to provide provable, tamper resistant timestamping for state changes.
* The use of ZKP's to provide automated validation and/or privacy.

## Blog 

* Upcoming*

## Resources
* [Intl. Supply Chain Sequence Diagram] (https://drive.google.com/file/d/1wPzEjGPr0QvHqF7O3ei3Wns28dVaQDX3/view?usp=sharing)
    * Sequence Diagram outlining the flow of documents created, notarized, and anchored throughout an international supply chain. 

* [Intl. Supply Chain BPMN Choreography] (https://drive.google.com/file/d/14lc3KXlZEf2HuYTvvqK1FG04uB09TlNE/view?usp=sharing)
    * BPMN Choreography Diagram to displaying the flow of state proposals and acceptance of documents throughout a supply chain process. 

* [Intl. Supply Chain Story Journey] (https://docs.google.com/document/d/1T2qVcatnUNw4sdlSEB3rMtVjXG3mxG9GWeaUZD2Mspo/edit?usp=sharing)
    * A high level user story, personas, and documents. Document details are included such as initiators, approvers, properties, ZK validation, and anchoring. 

* [Intl. Supply Chain Story Journey Advancement Predicates] (https://docs.google.com/document/d/1ep2J4W7hoXfeupDUu0kSFM5Sqi1p5RaVUdKSJvW1qjc/edit?usp=sharing)
    * Defines the business rules for advancement of each step of the user journey in a baselined supply chain. Advancement predicate are further broken down into assertions required by participant, credential, and zero knowledge proof.

* [Intl. Supply Chain User Stories] (https://docs.google.com/document/d/1UkeIESSCOdETNPi72xSnwgtjhu2NBeLUonkXI44ES3E/edit?usp=sharing)
    * Defines manageable pieces of the intl. supply chain business functionality that would allow developers to implement a trustless supply chain demo application that is baseline standard compliant. 