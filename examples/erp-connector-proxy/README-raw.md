<span class="c23 c28">“Baseline-SAP-Dynamics Demo”</span>

<span class="c3"></span>

<span class="c23 c31">Baselining Business Process Automation across SAP and Microsoft Dynamics</span>

<span class="c4">Stefan Schmidt (Unibright), Kyle Thomas (Provide), Daniel Norkin (Envision Blockchain)</span> <span class="c4 c9 c10"> May 21, 2020</span>

<span class="c3"></span>

# <span class="c8">Introduction</span>

<span>The “Baseline-SAP-Dynamics Demo” shows a setup of different Enterprise Resource Planning Systems (“ERPs”) using the Baseline Protocol to establish a common frame of reference on the</span> <span>public Ethereum Mainnet</span><span>. The demo extends the “</span><span class="c21">[Radish34 POC](https://www.google.com/url?q=https://docs.baseline-protocol.org/radish34/radish34-explained&sa=D&ust=1589996647925000)</span><span class="c3">”, showing a procurement process in a supply chain POC.</span>

<span class="c3"></span>

<span class="c3">The open-source-available code [LINK] of the development work on this demo evolved out of a Hackathon of the EEA Eminent Integration Taskforce members Unibright and Provide.</span>

<span class="c3"></span>

# <span class="c8">What is Baseline?</span>

<span class="c3"></span>

<span class="c3">The Baseline Protocol is an approach to using the public Mainnet as a common frame of reference between systems, including traditional corporate systems of record, any kind of database or state machine, and even different blockchains or DLTs. It is particularly promising as a way to reduce capital expense and other overheads while increasing operational integrity when automating business processes across multiple companies.</span>

<span class="c3">The approach is designed to appeal to security and performance-minded technology officers.</span>

<span class="c3"></span>

<span>You can find all the details on the Baseline Protocol here:</span> <span class="c21">[https://docs.baseline-protocol.org/baseline-protocol/protocol](https://www.google.com/url?q=https://docs.baseline-protocol.org/baseline-protocol/protocol&sa=D&ust=1589996647926000)</span>

# <span class="c8"></span>

# <span class="c8">Challenges and Scope of Work</span>

<span class="c3"></span>

<span>The setting of tasks in the Community Bootstrapping Phase of Baseline (</span><span class="c21">[https://docs.baseline-protocol.org/baseline-protocol/roadmap](https://www.google.com/url?q=https://docs.baseline-protocol.org/baseline-protocol/roadmap&sa=D&ust=1589996647927000)</span><span class="c3">) include extraction of concepts out of the Radish34 demo case into the protocol level. This demo therefore wants to extend the Radish34 case by integrating off-chain systems of record, to work out major challenges and provide solutions to them. The learnings should be manifested in a reference implementation that can support standards on the protocol itself.</span>

<span class="c3"></span>

<span class="c3">The Use-case shown in the demo follows this path:</span>

*   <span>A</span> <span class="c9">buyer</span><span>, using SAP ERP, creates a</span> <span class="c4">Request For Proposal</span><span class="c3"> and sends it out to 2 of his potential suppliers</span>
*   <span>One</span> <span class="c9">supplier</span><span>, using a Microsoft Dynamics D365 ERP, receives the</span> <span class="c4">Request For Proposal</span><span>, turning it into a</span> <span class="c4">Proposal</span> <span class="c3">with different price tiers, and sending it back to the buyer</span>
*   <span>The</span> <span class="c9">buyer</span> <span>receives this</span> <span class="c4">Proposal</span><span>, runs a comparison logic between different received proposals (including those of other suppliers), decides for one specific proposal, creates a corresponding</span> <span class="c4">Purchase Order</span><span class="c3"> and sends this to the supplier</span>
*   <span>The</span> <span class="c9">supplier</span> <span class="c3">receives the Purchase Order and continues the process</span>

<span class="c3"></span>

<span>The shown use-case does not claim to be complete. For example, no</span> <span class="c4">Master Service Agreements</span><span>are involved, and a productive process would continue with additional steps including</span> <span class="c4">Delivery Notes</span><span>,</span> <span class="c4">Invoices</span> <span>and</span> <span class="c4">Payments</span><span class="c3">, which are not in the scope of this demo.</span>

<span class="c3"></span>

<span>The participants discovered the following</span> <span class="c9">challenges</span> <span class="c3">to be addressed indispensably:  
</span>

*   <span>Establishing a non-centralized rendezvous point for multiparty business process automation, with such place also providing a</span> <span>solution for</span> <span class="c9">automating the setup of a baseline environment for each process participant</span><span> (here: a supplier or a buyer)</span><span class="c3"> on its own infrastructure (i.e., using the participant’s own AWS or Microsoft Azure credentials); and  
    </span>
*   <span>Establishing a minimum</span> <span class="c9">domain model</span><span class="c3">, abstracting from the baseline target objects and offering a process oriented entry point for systems of record to integrate; and  
    </span>
*   <span class="c9">Integrating systems</span><span> of record via a suitable service interface.</span>

<span class="c3"></span>

<span class="c3">The proposed architecture and solutions to these challenges are presented in the next sections.</span>

# <span class="c8">Architecture Proposal</span>

<span class="c3">  
The main idea is to orchestrate the container environment for each baseline participant in a way it supports the addressing of the mentioned challenges at best.</span>

<span class="c3"></span>

<span>Baseline itself is a microservice architecture, where the different components of this architecture are residing in docker containers.</span> <span>The existing radish demo applies a UI on top of this architecture to play through the demo case.</span>

<span class="c3"></span>

<span class="c3">The architecture proposal of this demo builds upon the existing microservices, and adds layers to extract communication and integration with baseline towards an external system.</span>

<span class="c3"></span>

<span style="overflow: hidden; display: inline-block; margin: 0.00px 0.00px; border: 0.00px solid #000000; transform: rotate(0.00rad) translateZ(0px); -webkit-transform: rotate(0.00rad) translateZ(0px); width: 190.00px; height: 228.00px;">![](/docs/images/image5.png)</span>

<span class="c7 c4">Microservice container environment for a participant in a baselined business process.</span>

<span class="c3"></span>

<span class="c9">Baseline Containers</span><span>: The microservices providing the Baseline Protocol and Radish34 use-case, based on this</span> <span class="c21">[branch](https://www.google.com/url?q=https://github.com/ethereum-oasis/baseline/tree/init-core&sa=D&ust=1589996647930000)</span><span class="c3"> in GitHub, including several key fixes (i.e., unwiring cyclic dependencies within the existing Radish34 environment) and enhancements (i.e., point-to-point messaging between parties, use of a generalized circuit for baselining agreements).</span>

<span class="c3"></span>

<span class="c9">Provide Containers</span><span>:</span> <span>Provide</span><span class="c3"> identity, key management, blockchain and messaging microservice API containers representing the technical entry point and translation layer for data and baseline protocol messages, and the provider of messaging infrastructure leveraged by the Baseline stack for secure point-to-point messaging.</span>

<span class="c3"></span>

<span class="c9">Unibright Proxy</span><span>: An extraction of the Unibright Connector (a blockchain integration platform), consisting of a simplified, context-related domain model and a RESTful api to integrate off-chain systems.</span>

<span style="overflow: hidden; display: inline-block; margin: 0.00px 0.00px; border: 0.00px solid #000000; transform: rotate(0.00rad) translateZ(0px); -webkit-transform: rotate(0.00rad) translateZ(0px); width: 239.00px; height: 361.00px;">![](/docs/images/image1.png)</span>

<span class="c4">The actual system of record is integrated by on premise or cloud based integration software in the domain of the respective Operator, leading to the “full stack.”</span>

<span class="c3"></span>

<span class="c3"></span>

<span style="overflow: hidden; display: inline-block; margin: 0.00px 0.00px; border: 0.00px solid #000000; transform: rotate(0.00rad) translateZ(0px); -webkit-transform: rotate(0.00rad) translateZ(0px); width: 602.00px; height: 273.33px;">![](/docs/images/image6.png)</span>

<span class="c7 c4">Each role in the process can run its own full-stack, connecting to the standardized Unibright Proxy.</span>

<span class="c7 c4"></span>

<span class="c7 c4"></span>

<span class="c3"></span>

<span class="c3"></span>

<span class="c3"></span>

# <span>Challenge: Automating the setup of a baseline environment for each process participant</span>

<span class="c3"></span>

<span class="c3">Implementing the demo use-case as described and demonstrated herein arguably illustrates levels of technical and operational complexity that would prevent most organizations from successfully applying the Baseline approach to their processes.</span>

<span class="c3"></span>

<span>A viable rendezvous point where every participant in a multiparty business process can “meet in the middle” to ensure common agreements exists between each party (i.e., agreement on the use-case/solution) and each technical team (i.e., agreement on the protocols, data models, integration points, etc.) is a prerequisite to</span><span class="c4"> </span><span class="c3">starting any actual technical integration. Such a rendezvous point can only be considered “viable” if it:</span>

<span class="c3"></span>

*   <span class="c3">is non-centralized; and</span>
*   <span class="c3">can automate container orchestration across major infrastructure vendors (i.e., AWS and Microsoft Azure); and</span>
*   <span>it can provide atomicity guarantees across all participants’ container runtimes during protocol upgrades (i.e., to ensure forward compatibility and continuity for early adopters)</span>

<span class="c3"></span>

<span class="c4">Shuttle</span> <span>is a</span> <span class="c4">bring-your-own-keys</span><span>rendezvous point enabling turnkey container orchestration and integration across infrastructure vendors.</span> <span class="c4">Shuttle</span><span> is a product built by Provide to de-risk multiparty enterprise “</span><span class="c4">production experiments</span><span>” using the Baseline Protocol, providing continuity to early adopters of the Baseline approach. Provide is actively contributing to the standards of the Baseline Protocol while commercially supporting</span> <span class="c4">Shuttle</span> <span>projects</span><span>.</span>

<span class="c3"></span>

<span>The following complexities related to enabling the Baseline Protocol for a multiparty process such as the one illustrated by the Radish34 use-case are addressed by</span> <span class="c4">Shuttle</span><span> as an enterprise rendezvous point</span><span class="c3">:</span>

<span class="c3 c11"></span>

*   <span class="c3">Infrastructure</span>

*   <span class="c3">Containers (and the dependency graph)</span>
*   <span class="c3">Blockchain</span>

*   <span class="c3">HD Wallets / Accounts</span>
*   <span class="c3">Meta transaction relay (i.e., enterprise “gas pump”)</span>
*   <span class="c3">Smart Contracts (i.e., deployment, interaction)</span>

*   <span class="c3">Organization Identity / PKI / x509</span>
*   <span class="c3">Key material (i.e., for advanced privacy, messaging, zkSNARKs)</span>

<span class="c3"></span>

*   <span class="c3">Baseline Protocol</span>

*   <span class="c3">Circuit Registry</span>
*   <span class="c3">Forward-compatibility</span>
*   <span class="c3">Point-to-point messaging (i.e., proof receipts, etc.)</span>
*   <span>Translation for DTO → Baseline Protocol</span>

<span class="c3"></span>

<span style="overflow: hidden; display: inline-block; margin: 0.00px 0.00px; border: 0.00px solid #000000; transform: rotate(0.00rad) translateZ(0px); -webkit-transform: rotate(0.00rad) translateZ(0px); width: 364.50px; height: 318.15px;">![](/docs/images/image2.png)</span><sup>[[a]](#cmnt1)</sup>

<span class="c7 c4">Baseline smart contract deployment to Ropsten testnet -- as of today, new projects are automatically subsidized by the Provide platform faucet when transaction broadcasts fail due to insufficient funds on every testnet. This same meta transaction / relay functionality will be helpful to organizations who want to participate in mainnet-enabled business processes in the future but do not want to hold Ether (i.e., when the Baseline Protocol has been deployed to the public Ethereum mainnet).</span>

<span class="c3"></span>

<span style="overflow: hidden; display: inline-block; margin: 0.00px 0.00px; border: 0.00px solid #000000; transform: rotate(0.00rad) translateZ(0px); -webkit-transform: rotate(0.00rad) translateZ(0px); width: 602.00px; height: 213.33px;">![](/docs/images/image15.png)</span>

<span class="c7 c4">Baseline smart contract suite intricacy, as illustrated by the contract-internal CREATE opcodes issued from within the Shuttle deployer contract. This functionality will become a standardized part of the Baseline protocol.</span>

<span class="c7 c4"></span>

<span style="overflow: hidden; display: inline-block; margin: 0.00px 0.00px; border: 0.00px solid #000000; transform: rotate(0.00rad) translateZ(0px); -webkit-transform: rotate(0.00rad) translateZ(0px); width: 602.00px; height: 286.67px;">![](/docs/images/image16.png)</span><span>  
</span><span class="c4">Container orchestration “work product” -- each organization, using its own AWS/Azure credentials, leverages Shuttle to automate the configuration and deployment of</span> <span class="c4">1</span><span class="c4">3</span><span class="c4"> microservice container runtimes to cloud infrastructure under their own auspices. Provide also has capability of supporting this for on-premise deployments via a redundant rack appliance.</span>

# <span class="c8">Challenge: Establishing Domain Model and Proxy</span>

<span class="c3"></span>

<span class="c3">As the Baseline Protocol itself is still in its bootstrapping phase, it was not possible to just use a perfectly working "Baseline" endpoint, and feeding it with perfectly designed and standardized data for the use case. To establish a development environment, in which all participants (e.g. distributed software teams) can continue working and are not blocking each other. One solution to this can be a proxy.</span>

<span class="c3"></span>

<span>A proxy is an intermediate layer that you establish in an integration process. The proxy only consists of simple</span><span class="c9"> domain model</span><span>descriptions and basic operations like "Get List of Objects", "Get Specific Object" or "Create new Specific object". So we created a Domain Model for the procurement use case we wanted to show, and designed basic DTOs ("Data Transfer Objects") for all the object types involved, like RequestForProposals, Proposals, PurchaseOrders and so on. We also generated a</span> <span class="c9">service interface</span><span class="c3"> for all these DTOs automatically, and an authentication service as well.</span>

<span class="c3"></span>

<span class="c3">The proxy defines the entry point for all integration partners in the use case scenario, agreeing on a common domain model and service layer. Still, every participant runs its own proxy, keeping the decentralised structure in place.</span>

<span class="c3"></span>

<span>The proxy does not perform any business logic on its own (apart from some basic example mappings to make the first setup easier), but is calling the Provide Shuttle stack in this demo using</span> <span class="c21">[this](https://www.google.com/url?q=https://github.com/provideservices/provide-dotnet&sa=D&ust=1589996647939000)</span><span class="c3"> open source project which provides the bridge between the proxy and Baseline protocol by way of the Provide stack.</span>

<span class="c3"></span>

# <span class="c8">Challenge: Integrating Systems of Record</span>

## <span class="c15">SAP ERP Integration</span>

<span>To help</span> <span>baselining</span><span class="c3"> SAP environments (following the Buyer role in this demo), Unibright configured the Unibright Connector (the integration platform of the Unibright Framework) to integrate and map the SAP models with the proxy automatically.</span>

<span class="c3"></span>

## <span style="overflow: hidden; display: inline-block; margin: 0.00px 0.00px; border: 0.00px solid #000000; transform: rotate(0.00rad) translateZ(0px); -webkit-transform: rotate(0.00rad) translateZ(0px); width: 602.00px; height: 276.00px;">![](/docs/images/image4.png)</span><span class="c24">Object Mapping in the Unibright Connector</span>

<span class="c3"></span>

<span style="overflow: hidden; display: inline-block; margin: 0.00px 0.00px; border: 0.00px solid #000000; transform: rotate(0.00rad) translateZ(0px); -webkit-transform: rotate(0.00rad) translateZ(0px); width: 347.24px; height: 634.50px;">![](/docs/images/image20.jpg)</span>

<span class="c7 c4">SAP Main Navigation Hierarchy for Purchasing Process, incl ME49 -> Price Comparison</span>

<span class="c3"></span>

<span class="c3"></span>

<span style="overflow: hidden; display: inline-block; margin: 0.00px 0.00px; border: 0.00px solid #000000; transform: rotate(0.00rad) translateZ(0px); -webkit-transform: rotate(0.00rad) translateZ(0px); width: 602.00px; height: 420.00px;">![](/docs/images/image19.jpg)</span>

<span class="c7 c4">Request for Quotation for 2 materials</span>

<span class="c3"></span>

<span class="c3"></span>

<span style="overflow: hidden; display: inline-block; margin: 0.00px 0.00px; border: 0.00px solid #000000; transform: rotate(0.00rad) translateZ(0px); -webkit-transform: rotate(0.00rad) translateZ(0px); width: 252.50px; height: 395.00px;">![](/docs/images/image12.jpg)</span>

<span class="c7 c4">Quotation to the Request, incl PriceScale referenced to the OrderItem</span>

<span style="overflow: hidden; display: inline-block; margin: 0.00px 0.00px; border: 0.00px solid #000000; transform: rotate(0.00rad) translateZ(0px); -webkit-transform: rotate(0.00rad) translateZ(0px); width: 602.00px; height: 494.67px;">![](/docs/images/image8.jpg)</span>

<span class="c7 c4">Resulting Purchase Order for Supplier (“Vendor” 100073)</span>

<span class="c3"></span>

## <span class="c15"></span>

## <span class="c3"></span>

## <span style="overflow: hidden; display: inline-block; margin: 0.00px 0.00px; border: 0.00px solid #000000; transform: rotate(0.00rad) translateZ(0px); -webkit-transform: rotate(0.00rad) translateZ(0px); width: 602.00px; height: 284.00px;">![](/docs/images/image13.png)</span><span class="c4 c7">Using the action Dashboard of the webversion of the Unibright connector to monitor SAP <> Proxy communication</span>

<span class="c3"></span>

## <span class="c15">Microsoft Dynamics</span>

<span>To help</span> <span>baselining</span><span class="c3"> Dynamics 365 environments, Envision Blockchain built an extension called Radish34 for Dynamics 365 Finance and Operations. While this demo is showing the Dynamics 365 Supplier environment, it’s important to note that the Radish34 extension is duly configured to support both roles (Buyer and Supplier). Below is a diagram showing the specific Dynamics 365 Finance and Operation modules used and the objects that are passing through the Radish34 extension.</span>

<span class="c3"></span>

<span style="overflow: hidden; display: inline-block; margin: -0.00px 0.00px; border: 1.33px solid #000000; transform: rotate(0.00rad) translateZ(0px); -webkit-transform: rotate(0.00rad) translateZ(0px); width: 354.91px; height: 199.50px;">![](/docs/images/image11.gif)</span>

<span class="c4">Radish34 Implementation Flow Chart</span>

<span class="c3"></span>

<span class="c3">After importing the extension, organizations will need to configure parameters to interact with the Unibright Proxy, setup Customer codes, Vendor codes, and setup custom Number sequences (which creates identifiers for Dynamics 365 objects).</span>

<span class="c3"></span>

<span class="c3"></span>

<span style="overflow: hidden; display: inline-block; margin: -0.00px 0.00px; border: 1.33px solid #000000; transform: rotate(0.00rad) translateZ(0px); -webkit-transform: rotate(0.00rad) translateZ(0px); width: 449.50px; height: 224.75px;">![](/docs/images/image3.png)</span>

<span class="c4">Radish34 Parameter Module</span>

<span class="c3"></span>

<span class="c3"></span>

<span class="c3"></span>

<span class="c3"></span>

<span class="c3"></span>

<span class="c10 c9 c23">Supplier Role</span>

<span class="c10 c23 c9"></span>

<span class="c3">When setting up Customers, you’ll need to identify customers using the Customer Setup Module and input the External code used in the Radish Module. The Value is automatically filled out by the proxy.</span>

<span class="c3"></span>

<span style="overflow: hidden; display: inline-block; margin: -0.00px 0.00px; border: 1.33px solid #000000; transform: rotate(0.00rad) translateZ(0px); -webkit-transform: rotate(0.00rad) translateZ(0px); width: 480.50px; height: 245.04px;">![](/docs/images/image14.png)</span>

<span class="c7 c4">Customer Setup Module</span>

<span class="c3"></span>

<span class="c3"></span>

<span class="c3">You can use the Radish34 service operations feature to make periodic or on-demand calls of the UB Proxy and receive RFPs.</span>

<span class="c3"></span>

<span style="overflow: hidden; display: inline-block; margin: -0.00px 0.00px; border: 1.33px solid #000000; transform: rotate(0.00rad) translateZ(0px); -webkit-transform: rotate(0.00rad) translateZ(0px); width: 431.50px; height: 220.05px;">![](/docs/images/image7.png)</span>

<span class="c7 c4">Radish34 Service Operations Module</span>

<span class="c3"></span>

<span class="c3"></span>

<span class="c3"></span>

<span class="c3"></span>

<span class="c3"></span>

<span class="c3"></span>

<span class="c3"></span>

<span class="c3"></span>

<span class="c3"></span>

<span class="c3"></span>

<span class="c3"></span>

<span class="c3"></span>

<span class="c3"></span>

<span class="c3"></span>

<span class="c3"></span>

<span class="c3">You can use the Sales Quotation module to view, adjust the prices for the items the Buyer is requesting, and send the quotation.</span>

<span class="c3"></span>

<span class="c3"></span>

<span style="overflow: hidden; display: inline-block; margin: 0.00px 0.00px; border: 1.33px solid #000000; transform: rotate(0.00rad) translateZ(0px); -webkit-transform: rotate(0.00rad) translateZ(0px); width: 456.50px; height: 285.75px;">![](/docs/images/image17.png)</span>

<span class="c4">Sales Quotation</span><span class="c7 c4"> Module</span>

<span class="c3"></span>

<span class="c3"></span>

<span class="c3"></span>

<span class="c3"></span>

<span class="c3">The Radish 34 Outgoing Proposals module allows you to approve, and send the proposal to the Buyer</span>

<span class="c3"></span>

<span style="overflow: hidden; display: inline-block; margin: 0.00px 0.00px; border: 0.00px solid #000000; transform: rotate(0.00rad) translateZ(0px); -webkit-transform: rotate(0.00rad) translateZ(0px); width: 437.00px; height: 274.96px;">![](/docs/images/image9.png)</span>

<span class="c4">Radish34 Outgoing Proposals Module</span>

<span class="c3">The Radish 34 Service Operations module will periodically check for incoming purchase orders from the Buyer</span>

<span class="c3"></span>

<span class="c3"></span>

<span style="overflow: hidden; display: inline-block; margin: 0.00px -0.00px; border: 1.33px solid #000000; transform: rotate(0.00rad) translateZ(0px); -webkit-transform: rotate(0.00rad) translateZ(0px); width: 519.42px; height: 292.50px;">![](/docs/images/image10.png)</span>

<span class="c7 c4">Radish34 Service Operations Module (Unchecked for incoming purchase orders)</span>

<span class="c7 c4"></span>

<span class="c7 c4"></span>

<span class="c7 c4"></span>

<span class="c3">The Sales Order modules to look at the approved proposal from the Buyer and confirm the sales order</span>

<span class="c7 c4"></span>

<span style="overflow: hidden; display: inline-block; margin: 0.00px 0.00px; border: 1.33px solid #000000; transform: rotate(0.00rad) translateZ(0px); -webkit-transform: rotate(0.00rad) translateZ(0px); width: 506.15px; height: 282.50px;">![](/docs/images/image18.png)</span>

<span class="c4">Sales Order module</span>

<span class="c3"></span>

# <span class="c8"></span>

<span class="c3 c11"></span>

<div class="c29">

[[a]](#cmnt_ref1)<span class="c3">Will this (and/or any of the  below) be a static graphic or a video snippet?</span>

</div>
