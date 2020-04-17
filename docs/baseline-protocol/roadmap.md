# Roadmap

## Community Bootstrapping Phase \(March - June 2020\)

Conduct weekly orientation sessions and bi-weekly/monthly alignment activities to ensure the community has -- and continues to have -- as close to a shared mental model about the nature, scope and priorities of the work as possible.

Abstraction activity \#1: Refine and solidify the namespace

Abstraction activity \#2: Create a repeatable way to add Workflow Steps, such as Invoice, to Radish34 POC.

Generalization activity \#1: Develop and analyze canonical horizontal use cases \(e.g., B2B contracting, Regulatory Oversight on Trade, Audit, Trace\) against the abstracted Radish34 structures.

Generalization activity \#2: Develop and prioritize functional and non-functional specifications for the Baseline Protocol with context and justification from canonical horizontal use cases. Start with framework: e.g., performance within single action vs performance assuming many different concurrent actions by different organizations.

Take a Step Back: Look at the emerging protocol as a strawperson and tear it apart. What doesn't work? What are the risks? What blocks acceptable performance for the most basic, viral applications of the approach? AND then turn the problems into _problems to solve_.

> If you want to turn problems into opportunities, always bring "two but's": "BUT that won't work...BUT it would if..."

This is a work in progress.

## Ideas for Future Epics:

### Uhoh, we're out of consistency and can't do this new Step...here's how we fix that.

Tools for fixing inconsistencies that show up in the execution of subsequent steps.

### Heartbeat:

Baseline servers do ongoing listening of their entangled records and send messages to the entangled counterparties of a record that has, for whatever reason, been changed without properly "re-baselining".

### Consistency Between Multiple Existing Records

The MV\(P\) of Baseline assumes that one party has a record that the other party does not. The party with the record is the Initiator, and they need to send the data \(and codebook\) to the Counter-parties that they want to baseline with.

But what if two \(or more!\) parties have what they think is the same record, and they want to a\) confirm that they match; b\) if they do, baseline the record, so that they can use it for Workflow Steps to follow; c\) if they don’t, go through some process of determining which should be Canon, setting the others to that value, and then baselining.

### Traceability with privacy

The MVP of baseline establishes traceability of a state \(MSA\) to issuances of subsequent updates, such as placing a PO is dependent on the prevailing state/value of the MSA linked to it. However, identities of the entities involved is still not being addressed fully. Without revealing identities or "linkability" to identities, Baselined components can be added with additional privacy techniques for masking identities and reduce identifiability of entities involved in the workgroup. This could further involve modifications and standardizations for Shield and Verifier contracts used for on chain verification of off chain proofs.

### Decentralized identity management

Support for Decentralized Identity Management \(Enablement of DID's to create standardized digital identities that can be used to represent identities in a verifiable way\). This could be addressed directly in the Baseline core by standardizing the usage of the OrgRegistry contract in the MVP.

### Advances in privacy and performance

Optimizations on chain execution of business logic, improvements to performance and security considerations for ZKP based techniques to provide faster and cheaper means of off chain proof execution and on chain validation. Some areas include addressing the concern around multiple trusted set ups \(which varies from business to business and app to app\), batch verification techniques and improved ZKP protocols \(and underlying cryptographic schemes\)

