# APIs

The APIs written in GraphQL serve to orchestrate the overall application management, and contains components that enable UI (GraphQL), blockchain, ZKP, messenger, and data integrations. In particular, API orchestration is also handled using queue management based approach leveraging a light weight queueing tool called BullJS. The choice of GraphQL is to separate the data interaction from the web service interaction layer - this helps enable data integrations with external systems and separately manage a web service abstraction for front end integrations.

