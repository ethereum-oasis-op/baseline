import express from 'express';
import { partnerCreateRFP, partnerSignedRfp, deliveryReceiptUpdate } from '../integrations/rfp';

const router = express.Router();

router.post('/documents', async (req, res) => {
  const messageObj = req.body;
  let docId;
  console.log('Received new document. Parsing now...');
  switch (messageObj.type) {
    case 'rfp_create': // inbound RFP from partner
      try {
        docId = (await partnerCreateRFP(messageObj))._id;
      } catch (error) {
        res.status(400);
        res.send({ message: 'Could not create new RFP. Required fields: uuid' });
        return;
      }
      break;
    case 'rfp_signature': // i.e. supplier signs RFP and sends back to buyer
      console.log('RPF SIGNATURE post body', messageObj);
      docId = (await partnerSignedRfp(messageObj))._id;
      break;
    case 'delivery_receipt':
      // ex: supplier's messenger automatically sends this message type after receiving buyer's RFP
      docId = (await deliveryReceiptUpdate(messageObj))._id;
      break;
    // case 'msa_create':
    // docId = await msaUtils.createMSA(messageObj);
    // break;
    // case 'msa_update':
    // docId = await msaUtils.updateMSA(messageObj);
    // break;
    // case 'po_create':
    // docId = await poUtils.createPO(messageObj);
    // break;
    // case 'po_update':
    // docId = await poUtils.updatePO(messageObj);
    // break;
    // case 'invoice_create':
    // docId = await invoiceUtils.createInvoice(messageObj);
    // break;
    // case 'invoice_update':
    // docId = await invoiceUtils.updateInvoice(messageObj);
    // break;
    default:
      console.log('Did not recognize message object type:', messageObj);
  }
  res.status(200);
  res.send({ message: `Document (ID: ${docId}) added or updated in radish-api` });
});

export default router;
