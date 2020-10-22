# Overview

The Baseline Protocol is a set of techniques and specifications that can be implemented by any number of products, services and solutions.  

The baseline initiative's primary mission is to standardize these abstract techniques within the OASIS open standards process. To do that, it's best to start in the crucible of real, functional code. Through the intensive development of a set of core working packages and reference implementations, the team discovers what works and what needs to be specified in the standard.

Both the core libraries and the reference implementations should be thought of as a starting point for developers, a way of understanding the techniques and getting a jump start on their own work. So long as a developer follows the standard specifications of the baseline protocol, their work should interoperate with anyone else's implementation. 

If the core libraries and the reference implementations are just instances of the standard, why separate them into [core/](https://github.com/ethereum-oasis/baseline/tree/master/core) and different reference implementations \(see [examples/](https://github.com/ethereum-oasis/baseline/tree/master/examples)\)?  The answer is that the separation makes it easier to implement changes. The core should always be stable and capable of informing specifications development, where reference implementations are more "opinionated" and can constitute different approaches that utilize specific components, infrastructure, etc., while using the same core interfaces.

> The core libraries are rails for standardization while reference implementations are rails for adoption.

### Guidelines

Companies and individuals contributing to the Baseline Protocol are not putting in effort out of a sense of charity. Each organization and individual contributor can and should be able to draw a straight line from the strengthening of the protocol to their own commercial or individual success.

To this end, Reference Implementations -- not unlike different implementations of the Ethereum Yellow Paper -- may build-in dependencies on specific products or add proprietary components and tools that might feature or advantage a company or group of companies. This is allowed -- and encouraged -- so long as **the Reference Implementation does not introduce confusing naming or positioning that would give a developer the sense that those elements are essential for** _**baselining**_. That said, the best Reference Implementations will endeavor to be modular so that their work can be used with a variety of components without someone having to perform "surgery" on the code.

Over time, it is expected that many implementations -- both proprietary and otherwise -- will be developed and not submitted back into the Baseline Protocol open source repository. But the community is grateful to those companies and individuals that _provide_ their work as contributions back to open source. These contributions are stored in the [examples/ ](https://github.com/ethereum-oasis/baseline/tree/master/examples)folder of the repository under the naming convention below.

_Note: All source code in the Baseline Protocol_ [_repository_](https://github.com/ethereum-oasis/baseline) _is licensed under the Public Domain CC0-Universal license; it can be forked and any of its contents can be copied and used by others at will._

### Naming & Conventions

On August 26, 2020, the first set of generalized core libraries for the baseline protocol were released, and the team delivered a new reference implementation to go with it. By convention, all subsequent implementations will follow the form **"BRI-\#".**

Most/all baseline reference implementations shall include a "base" example application, reusable libraries, and sometimes relevant components, such as specific connectors.

### **BRI-1**

Baseline Reference Implementation \#1 \([BRI-1](bri-1/)\) was developed by contributors from Provide, Nethermind, EY and others, with support and oversight from the entire Baseline Maintainer team. This implementation correctly utilizes the core Baseline Protocol abstract interfaces, which are free of dependencies on any particular set of components or proprietary systems, but it also relies heavily on tools and systems made available by Provide and Nethermind. Provide's [Shuttle](https://shuttle.provide.services/waitlist) infrastructure deployment and manifold system is used by many _baselining_ developers to make their work easier. Nethermind is the first Ethereum public client to implement the `IBaselineRPC` interface \(found [here](https://github.com/ethereum-oasis/baseline/tree/master/core/api#interfaces)\). NATS is a production-ready enterprise messaging layer that meets the privacy and performance requirements for baselining. 

Details on BRI-1 can be found [here](bri-1/), and the code can be found [here](https://github.com/ethereum-oasis/baseline/tree/master/examples/bri-1). 

### **Radish34**

Strictly speaking, Radish34, the first demo code that started the Baseline Protocol project in 2019, is not a reference implementation. It is a complete stack written as a proof of concept for a specific story around the use case of purchase orders and discount agreements. This work does not separate the implementation from a set of core, abstract interfaces. But it did allow the open source community to begin the abstraction and generalization process that resulted in the Baseline Protocol v0.1 \(and subsequent\) versions.

Radish34 might be called BRI-0, but for historical purposes, and so as not to confuse people who have "grown up" with Radish34 on their baseline journey, we keep the name.

