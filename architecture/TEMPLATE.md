---
title: Template
description: Templates for architecture specs
---

# Arch Spec: <!-- Project/Feature name -->

## People

### Authors

- <name>, [<handle>](profile-url)
-

### Engineering

- <name>, [<handle>](profile-url)
-

### Product

- <name>, [<handle>](profile-url)
-

### QA

- <name>, [<handle>](profile-url)
-

## Definitions

- **<Term>** - <Definition>

## Overview

<!--
  General Overview, maybe 1-3 sentences, detailing the "what". What is this,
  what's purpose will it serve.
-->

## Context

<!-- Some context as to WHY. What problems is this solving. -->

## Goals

<!-- Ultimate Goals of project/feature. Acceptance criteria of sorts. -->

## Non-Goals

<!-- Clarify/call out things that this project/feature should NOT be doing. -->

## Milestones

<!-- Initial proposed dates for kick off, soft launch, MVP, etc. -->

| Date          | Milestone                                                |
| ------------- | -------------------------------------------------------- |
| <!-- Date --> | Start Date                                               |
| <!-- Date --> | Milestone 1 - <!-- Example: Complete foundation work --> |
| <!-- Date --> | Milestone 2 - <!-- Description -->                       |
| <!-- Date --> | Milestone 3 - <!-- Description -->                       |

<!-- as many as you want -->

## Current Implementation

<!-- Detail the current implementation for added context. -->

# Proposed Solution

<!--
  Describe, IN DETAIL, the proposed solution. Breakdown of this section is flexible.
  Feel free to include images, flow charts, schema diagrams, code examples, etc. We've
  Included examples of some of the things you can, but are NOT limited to include below.
-->

## Process Flow

<!--
  What is the flow of your solution from start to finish? What this actually entails can vary from
  project to project: this can be user flows, or a more under the hood, but either way it should
  answer the question "what steps does this project need to take from start to finish?" Those steps
  should then be detailed out below as to roughly how you would accomplish them.
  This can be further broken out into subprocesses if necessary.
-->

1. Step one
2. Step two
   1. Step two sub-step
   2. Step two sub-step
3. Step three

## Storage (on-chain vs off-chain (centralized vs distributed))

<!-- Detailed technologies being used and include schemas. Schema diagrams are welcome. -->

## Blockchain

<!-- Which blockchain will you be using and why? Consensus Mechanism? -->

## Contracts & Token Standards

<!--
  What contracts do you envision creating? You should have thought through the functionality
  as part of this architecture process. Please share here how you see these contracts being
  implemented. How they will work together. Will there be interfaces? Code examples of how
  things will work are key. Will you be leveraging an existing project like dicon or ops
  chain in concert with new contracts? And how we plan on actually sharing contracts
  between projects? OpenZeppelin npm module approach? etc.
-->

## Services

<!--
  What services will you be creating? How will they be interacting with each other?
  What existing services/applications are you going to need? Will it leverage ops chain? DiCoN?
  How will you be authenticating across services? Authentication service? Organization? etc.
-->

## Infrastructure

<!--
  Deployment (i.e. client on-prem/cloud, EY cloud, managed service, app appliance). CI/CD approach?
-->

## Alternative Solutions

<!-- Detail other possible solutions you considered, and why you ultimate decided against them. -->

## Testing

<!-- What testing will be included in the solution. -->

## Monitoring and Alerting

<!--
  What monitoring & alerting will be included in the solution if applicable.
  Loggers, application monitoring i.e. New Relic, etc.
-->

## Suggested Future Work

<!-- What won't be in the MVP, that we could add down the road? -->

## Detailed Scoping and Timeline

<!-- Break out different tasks and estimated time to complete. -->

## Footnotes

- <sup>1</sup> Footnote description.
- <sup>2</sup> Footnote description.
