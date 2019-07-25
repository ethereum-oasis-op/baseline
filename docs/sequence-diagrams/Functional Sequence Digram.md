![Alt text](./Radish34_Procurement_Flow_Timing_Sequence_Diagram.jpg?raw=true "Radish 34 Procurement Flow Sequence Diagram")

## Description

This figure depicts a functional flow of the interactions between the various actors in the procurement use case. Each sequence or atomic flow of a business transaction is abstracted based on actor level interactions or sub-sequences of events. Each of such sequences has been numbered based on the transition of one state to another. The overall diagram can be used as an input for data requirements, service integration level sequence/timing diagrams and UX design prints and additional flows. Following flows can be identified from this diagram:

1. Winning Supplier Flow: Flow of events for choosing the winning supplier based on a calculation logic that determines the volume distribution in the PO, to be issued by Buyer to Supplier.
> The winning suppliers both have the same contract rules: the price per widget declines by 5% every 100,000 widgets up to a maximum decline per calendar year of 25%.  However, for every $1 that the price of oil rises above $50, the price of those widgets goes up by 1%  The volume purchase meters are separate for each supplier.  Supplier A’s baseline price is $10 per widget.  Supplier B is $11 per widget. 
2. Oil Price Calculation Flow: Flow of events for fetching the current oil price from an external oracle, and calculation of the quoted price, as part of the RFQ response from Supplier(s) to the Buyer.
> The winning suppliers both have the same contract rules: the price per widget declines by 5% every 100,000 widgets up to a maximum decline per calendar year of 25%.  However, for every $1 that the price of oil rises above $50, the price of those widgets goes up by 1%  The volume purchase meters are separate for each supplier.  Supplier A’s baseline price is $10 per widget.  Supplier B is $11 per widget. 
3. Manufacturing Flow: Flow of events for (de)composing of tokens representational of widgets, pallets and shipment orders, including the calculation/tracking of widget manufacturing across multiple regions overseen by the Supplier.
> The widgets themselves are assembled in Mexico and shipped across the border to the US.  The widgets are made of 3 components.  Component 1 is made in Mexico and is worth 30% of widget value.  Component 2 is made in Canada and is worth 35% of widget value.  Component 3 is made in Japan and is worth 35% of widget value.  Each shipping pallet contains 100 widgets and we can get 3 pallets into each full delivery truckload.  The minimum order quantity is always 300 widgets (e.g. one full truck-load) and this must be enforced by the system.
4. Rights Token Flow: Flow of events associated with transferring of tokens (custody) from Supplier to Carrier, and correspondingly tracking the ownership at (de)composition levels.
5. Delivery Confirmation Flow: Flow of events for confirming delivery and the resulting transfer of ownership and shipping tokens between Supplier, Carrier and Buyer.
6. Payment Token Flow: Flow of events for managing a Net30 receivable token and issuing payments using ERC20 (721) tokens between Supplier and Buyer.
> They are allowed to invoice the customer on net-30 terms at the time of shipment.  Invoices are paid automatically on the net-30 schedule provided two rules are met: (1) the carrier reports delivery of the shipment to the customer and (2) the customer does not report any problems or issues with the shipment prior to the net-30 deadline.
7. Shipping Token Flow: Flow of events for creating a shipping token tracked at the pallet level by the carrier.
8. Dispute Management Flow: Flow of events to manage disputed items on delivery, and transfer payment tokens between Buyer and Supplier.


In addition, following flows can be considered to be adjacent or pre-requisite functional flow diagrams for this diagram:

1. Organization Management: Sequence diagram to detail an overall functional flow of events for onboarding organizations as participants of the network.
2. Authentication Management: Sequence diagram to detail the interface of organization management with procurement view.

## Open Questions

1. What needs to be public/private about RFQ? Should we consider tokenizing this?
2. Should ownership be tracked at a widget level for legal ownership, or at a shipping container level for shipping token ownership and transfer of rights ownership?
3. How should Oracle be interfaced? Should it be for oil prices or are there any other attributes?
4. Dispute management in general is around disputes with price reconciliation, and blockchain based solutions typically address this due to transparency of data and logic on chain. Defective products are typically addressed as part of the contractual agreement. How do we envision the defective products and related revised payments be built in for this use case?

