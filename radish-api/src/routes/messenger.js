const express = require('express');
const rfpUtils = require('../integrations/rfp.js');

const router = express.Router();

router.post('/documents', async (req, res) => {
  let messageObj = req.body;
  let docId;
  switch (messageObj.type) {
    case 'rfp_create':
      try {
        docId = await rfpUtils.partnerCreateRFP(messageObj);
      } catch (error) {
        res.status(400);
        res.send({ message: 'Could not create new RFP. Required fields: uuid' })
        return;
      }
      break;
    case 'rfp_update':
      docId = await rfpUtils.partnerUpdateRFP(messageObj);
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
