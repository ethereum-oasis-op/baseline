---
description: >-
  page to contain the Figma demo and links to setting up the actual demo.  note:
  hoping to include TJ's more extensive Figma visualization of the complete
  flow.
---

# Radish34 Interactive Demo

You can build and run your own functioning instance of the [**Radish34 proof of concept here**](radish34-poc.md). 

But if you want to see what it might be like for a group of companies to use the Baseline Protocol in a wider set of supply chain operations, here is an [interactive visualization](https://www.figma.com/proto/XQ9sIPu0FeoNSojX8YQtmz/Radish34?node-id=759%3A13805&viewport=150%2C167%2C0.05065051466226578&scaling=min-zoom):

### [**Click Here for Radish34 Demo**](https://www.figma.com/proto/XQ9sIPu0FeoNSojX8YQtmz/Radish34?node-id=759%3A13805&viewport=150%2C167%2C0.05065051466226578&scaling=min-zoom) 

![](../.gitbook/assets/image%20%282%29.png)

## Demo Workflow

In the supply chain story we staged in this application the user can play the role of Buyer who wants to place an order with Suppliers for X number of widgets. They also can play the role of Supplier who works with the Buyer to fulfill their purchasing needs.

The story begins with the Buyer creating a Request for Proposals and sending it to several suppliers, getting proposals back, selecting one proposal, and then Baselining the MSA contract between the Buyer and Supplier.

#### Setup

Ahead of playing through the story there are a few setup tasks to make the whole prototype demo experience work. You first need to run the setup process in the development environment to make sure you configure your demo environment.

#### A supply chain story

We broke down the supply chain procurement process into two phases; Contracting and Ongoing. The Radish demo only captures key parts of the contracting phase at this point in development. Supporting the ongoing phase of procurement will come very soon.

#### Contracting Phase

**Buyer context**: My R&D department has given me a request for a new part X for our product Y. I need to find two domestic suppliers for this part who can fulfill my expected 12 month volume.

1. Browse the list of suppliers in the Global registry \(via the Radish App UI\) for the supplier who carries part X.
2. Select two suppliers from the list who can deliver the approximate volume.
3. Click "Draft an RFQ" for this SKU/new part for the selected suppliers and enter in my estimated Qty needed.
4. Click "send" deliver it to the selected suppliers.
5. Wait for suppliers to respond with initial MSA agreements that contain their rate tables for part X at different quantities.
6. Review each and "sign & return" each of the MSA contracts from the suppliers.
7. Done with contracting phase.

**Supplier context**: I manufacture newly developed Part X. I know my volume capabilities and have rate tables I can provide to prospective buyers.

1. Add my company global Registry \(during Radish setup\).
2. Add new Part X to my system, publish Part X to my global registry entry.
3. Wait for an RFQ from a buyer.
4. New RFQ request comes in from Buyer for Part X.
5. I reply to RFQ with a pre-signed MSA contract that includes my rate table.
6. Wait for Buyer to sign.
7. I am notified when buyer signs.
8. Done contracting phase.

#### Ongoing Phase

**Buyer  context:** We have an MSA with two suppliers for part X. It's now time to order the part so we can have the inventory we need to begin manufacturing.

1. Select from a list of my parts, the new part X for product Y.
2. With the part selected, create a new PO and allow me to enter the Qty/delivery dates I need.
3. Since this part has two contracted suppliers \(from contracting phase\), I can see my PO total price based on the MSA I have with each supplier, and any existing PO's I have sent are calculated into my rate.
4. Send PO to selected suppliers.
5. Wait for suppliers to accept the PO and update the PO status to "in fulfillment."
6. Wait for invoice.
7. Receive invoice from suppler, open it, and click "pay."
8. This PO is now completed/closed. Other POs could be still open, I am able to view the status of those.

**Supplier context**: We have an MSA for Part X with a Buyer. At this point I am just waiting for POs. Also, I am such a good supplier that I can always meet customer qty and time frame demands so I accept every PO I receive.

1. Receive notification of new PO from buyer.
2. Acknowledge the PO and change the PO state to "in fulfillment."
3. Go do the work of fulfilling the order for Part X.
4. Order filed, find the PO and create an invoice against it. The details are pulled from the PO.
5. Satisfied with the Invoice I click 'send' to deliver the invoice to the Buyer.
6. I wait to be paid.
7. I am notified when the buyer pays.
8. PO/Invoice phase completed.

