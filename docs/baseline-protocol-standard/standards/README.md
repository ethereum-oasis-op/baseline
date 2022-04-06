# Standard In Development

#### This section is work in progress as the baseline protocol community gears up to write standard specifications under the [OASIS](https://oasis-open.org) process. <a id="this-section-is-work-in-progress-as-the-baseline-protocol-community-gears-up-to-standardize-the-learnings-from-the-radish34-poc-and-develop-the-protocol"></a>

The Baseline Protocol community will use this section to coordinate, memorialize and publish specifications.  The specification documents will appear in the repo beginning in September 2020.

## High Level Context <a id="high-level-context"></a>

### Canonical Use Cases and Patterns <a id="canonical-use-cases-and-patterns"></a>

Requirements, and non-functional requirements in particular, are meaningful only in the context of use. As a protocol designed for wide usage, the baseline pattern begs a set of cases that are well suited it. It's also wise to sketch the boundaries of what constitutes a sensible use of the pattern. That is the intent of this section.

## Abstract <a id="abstract"></a>

This document, the Baseline Specification, defines the implementation requirements for maintaining data consistency and workflow continuity \(with [atomic compartmentalization]()\) among sets of state machines that are operated by different [Parties](./). The Baseline Specification assumes the use of a public Mainnet as the necessary common frame of reference to achieve this, and it uses the public Ethereum [Mainnet](./) as the reference implementation.

> When two or more machines store data and run business logic in a verified state of consistency, enabled by using the Mainnet as a common frame of reference, then the machines, data and code are said to be _baselined_.

This specification includes the definition of interfaces to internal and external components, how they are intended to be used, and the minimum standards above which they must perform.

## **Status of this Document** <a id="status-of-this-document"></a>

The Baseline Specification is in draft and currently does not have a version number. 

GitHub Issues managed in [Zenhub](https://github.com/ethereum-oasis/baseline/tree/master/radish34/ui#workspaces/baseline-5e713dc4f555144d9d6d17f6/roadmap?repos=239590893) as Epics, Stories, Tasks \(and their comments\) are preferred for discussion of this specification.

## Introduction <a id="introduction"></a>

It is generally understood that state machines, from a simple database to various forms of enterprise systems of record, require a common frame of reference when they need to maintain consistency and continuity with other state machines. The field of distributed systems provides for several patterns that accomplish this, each involving tradeoffs.

The pattern defined here is predicated on the use of a singleton state machine as a common frame of reference between two or more systems.

## Conformance <a id="conformance"></a>

As well as sections marked as non-normative, all authoring guidelines, diagrams, examples, and notes in this specification are non-normative. Everything else in this specification is normative.

The key words _MAY_, _MUST_, _MUST NOT_, _SHOULD_, and _SHOULD NOT_ in this document are to be interpreted as described in [BCP 14](https://tools.ietf.org/html/bcp14) \[[RFC2119](https://entethalliance.github.io/client-spec/spec.html#bib-rfc2119)\]\[[RFC8174](https://entethalliance.github.io/client-spec/spec.html#bib-rfc8174)\] when, and only when, they appear in all capitals, as shown here.

#### 2.1 Experimental Requirements <a id="x2-1-experimental-requirements"></a>

This Specification includes requirements and Application Programming Interfaces \(APIs\) that are described as _experimental_. Experimental means that a requirement or API is in early stages of development and might change as feedback is incorporated. Implementors are encouraged to implement these experimental requirements, with the knowledge that requirements in future versions of the Specification are not guaranteed to be compatible with the current version. Please send your comments and feedback on the experimental portions of this Specification to the EEA Technical Steering Committee at [https://entethalliance.org/contact/](https://entethalliance.org/contact/).

​

**This section is a work in progress.**

