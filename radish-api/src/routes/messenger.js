const express = require('express');
const rfpUtils = require('../integrations/rfp.js');

const router = express.Router();

router.post('/documents', async (req, res) => {
  let messageObj = req.body;
  let docId;
  console.log('Received new document. Parsing now...')
  switch (messageObj.type) {
    case 'rfp_create': // inbound RFP from partner
      try {
        docId = (await rfpUtils.partnerCreateRFP(messageObj))._id;
      } catch (error) {
        res.status(400);
        res.send({ message: 'Could not create new RFP. Required fields: uuid' })
        return;
      }
      break;
    case 'rfp_update': // i.e. supplier signs RFP and sends back to buyer
      docId = (await rfpUtils.partnerUpdateRFP(messageObj))._id;
      break;
    case 'delivery_receipt': // i.e. supplier signs RFP and sends back to buyer
      //docId = (await rfpUtils.deliveryReceiptUpdate(messageObj))._id;
      docId = 'FAIL'
      break;
    //case 'msa_create':
    //docId = await msaUtils.createMSA(messageObj);
    //break;
    //case 'msa_update':
    //docId = await msaUtils.updateMSA(messageObj);
    //break;
    //case 'po_create':
    //docId = await poUtils.createPO(messageObj);
    //break;
    //case 'po_update':
    //docId = await poUtils.updatePO(messageObj);
    //break;
    //case 'invoice_create':
    //docId = await invoiceUtils.createInvoice(messageObj);
    //break;
    //case 'invoice_update':
    //docId = await invoiceUtils.updateInvoice(messageObj);
    //break;
    default:
      console.log('Did not recognize message object type:', messageObj);
  }
  res.status(200);
  res.send({ message: `Document (ID: ${docId}) added or updated in radish-api` })
});

export default router;
