---
description: >-
  Describe the key things the baseline community needs to see improved,
  supported, created in order to grow as a protocol, so that enterprises will
  use the approach and get used to the Mainnet.
---

# Driving Mainnet Evolution

The purpose of this section is to list and describe the key things the baseline community needs to see improved, supported or created in order to grow as a protocol, so that enterprises will use the approach and get used to employing the Mainnet in normal business activities.

## Point to Point Messaging

The Radish34 demo uses Whisper, which comes with standard Geth nodes. However, it is not ideal for _baselining_. The ideal messaging service, which the Baseline Protocol community will endeavor to specify and promote, would:

* Send data point-to-point, stored only by specified counter-parties with no intermediary storage; 
* Able to specify different counter-parties on a message-by-message \(or at least Workflow Step by Step\) basis; 
* Balance appropriate liveness and safety guarantees optimally for baselining; 
* Handle long session management without blocking and without "frankenstein" code.

It has been suggested that the Baseline Protocol community consider looking into the [Corda Flows](https://github.com/corda/corda) open source repository as an example of a potential design pattern that would suit baselining. If so, an effort to implement such a pattern in an Ethereum client such as Hyperledger Besu could be a way forward.

## Zero Knowledge Service \(Zokrates and zkSnark related improvements\)

While the baseline approach isn't solely about zero knowledge techniques, it uses them to ensure that all parties store the same data in their respective systems of record, execute business rules consistently, and enforce the correctness of Workflow Steps.

One aspect of this is Zokrates, a domain specific language \(DSL\) for taking logical functions and turning them into the "addition, subtraction, multiplication" math required by zero knowledge proofs. Zokrates is an open source project maintained by \[ \]. From the perspective of the enterprise, it has the disadvantage of being distributed under a \[ \] license, not Apache2 or MIT.

For enterprises to adopt a DSL like Zokrates as part of their core IT stack, it needs to be GA'd, the problem of the license must be dealt with -- there are a number of ways to handle this -- and the project must be well supported at a level that can give enterprises confidence.

## Eth2

The Baseline Protocol can provide utility for a variety of uses across industries today on the current iteration of Ethereum. It avoids several of the key issues enterprises have with using "public" Ethereum. But some issues remain. Notably, the "Noisy Neighbor" concern. It is hoped that Eth2 will put many of these issues to rest or bring them to acceptable levels of performance and risk. The Baseline Protocol community needs to be a leading, helpful voice in the evolution of Eth2.

## Gas Pump Service

Many established companies are not comfortable with, or are prohibited from, holding cryptocurrency -- even if just to power IT operations \(e.g., $gas charges for placing Baseline Proofs on the Mainnet\). For the foreseeable future, enterprises wishing to conduct baselining may need a way to have someone else pay the $gas and then bill them _old-school_ in fiat currency.

## Barriers to Enterprise Adoption of Public Blockchain

The attached document from the EEA Mainnet Working Group lists the "top ten" reasons why a conservative, security-minded corporate officer has concerns about using the public Mainnet. It provides a brief profile on the kind of person who has these concerns and what may be on their minds day-to-day. The Baseline Protocol aims to avoid most of these and bring the rest to a level that would be considered normal and tolerable in a high-security corporate IT environment.

{% file src="../../.gitbook/assets/why-i-wont-use-the-mainnet-ten-problems-6-1 \(1\).pdf" %}

