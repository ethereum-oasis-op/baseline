import express from 'express';
import {
  partnerCreateRFP,
  deliveryReceiptUpdate,
} from '../db/models/modules/rfps';
import { saveProposal } from '../db/models/modules/proposals';
import { onReceiptMSABuyer, onReceiptMSASupplier } from '../services/msa';
import { onReceiptAgreementSender, onReceiptAgreementRecipient } from '../services/agreement';
import { onReceiptPOSupplier } from '../services/po';
import { logger } from 'radish34-logger';

const router = express.Router();

router.post('/documents', async (req, res) => {
  const messageObj = req.body;
  const { type, deliveredType, senderId, _id } = messageObj;
  let docId;
  logger.info(`Received new document of type ${type}. Parsing now...`, { service: 'API' });
  switch (type) {
    case 'rfp_create': // inbound RFP from partner
      try {
        docId = (await partnerCreateRFP(messageObj))._id;
      } catch (error) {
        res.status(400);
        res.send({ message: 'Could not create new RFP. Required fields: uuid' });
        return;
      }
      break;
    case 'delivery_receipt':
      // ex: supplier's messenger automatically sends this message type after receiving buyer's RFP
      // Todo: need to enhance to handle each document types, now deliveryReceiptUpdate() only handles RFP
      if (deliveredType === 'rfp_create') {
        docId = (await deliveryReceiptUpdate(messageObj))._id;
      }
      if (deliveredType === 'po_create') {
        docId = (await deliveryReceiptUpdate(messageObj))._id;
      }
      break;
    case 'proposal_create':
      try {
        docId = (await saveProposal(messageObj))._id;
      } catch (error) {
        res.status(400);
        res.send({ message: error });
      }
      break;
    case 'agreement_create':
      try {
        console.log('\n\n\nReceived Agreement\n');
        console.dir(messageObj, { depth: null });
        onReceiptAgreementRecipient(messageObj, senderId);
        docId = _id;
      } catch (error) {
        res.status(400);
        res.send({ message: error });
      }
      break;
    case 'signed_agreement':
      try {
        console.log('\n\n\nReceived Signed Agreement\n');
        console.dir(messageObj, { depth: null });
        onReceiptAgreementSender(messageObj, senderId);
        docId = _id;
      } catch (error) {
        res.status(400);
        res.send({ message: error });
      }
      break;
    case 'msa_create':
      try {
        logger.info(`Received MSA:\n%o`, messageObj, { service: 'API' });
        onReceiptMSASupplier(messageObj, senderId);
        docId = _id;
      } catch (error) {
        res.status(400);
        res.send({ message: error });
      }
      break;
    case 'signed_msa':
      try {
        logger.info(`Received signed MSA:\n%o`, messageObj, { service: 'API' });
        onReceiptMSABuyer(messageObj, senderId);
        docId = _id;
      } catch (error) {
        res.status(400);
        res.send({ message: error });
      }
      break;
    // TODO: NEED THE SUPPLIER TO BE ABLE TO:
    //   -  Update the MSA with the Buyer's signature details
    //   -  Update the MSA with a new commitment index (in the merkle tree)
    //   - NOTE: the case of updating an MSA with a new commitment is handled within the po_create and invoice_create responder functions.
    // case 'msa_update_buyer_signature'
    // case 'msa_update_commitment_index'
    // TODO: figure out how to amalgamate the above two updates into one.
    // case 'msa_update':
    // docId = await msaUtils.updateMSA(messageObj);
    // break;
    case 'po_create':
      try {
        logger.info(`Received PO:\n%o`, messageObj, { service: 'API' });
        onReceiptPOSupplier(messageObj, senderId);
      } catch (error) {
        res.status(400);
        res.send({ message: error });
      }
      break;
    // case 'po_update':
    // docId = await poUtils.updatePOById(messageObj);
    // break;
    // case 'invoice_create':
    // docId = await invoiceUtils.createInvoice(messageObj);
    // break;
    // case 'invoice_update':
    // docId = await invoiceUtils.updateInvoice(messageObj);
    // break;
    default:
      logger.info(`Did not recognize message object type:\n%o`, messageObj, { service: 'API' });
  }
  res.status(200);
  res.send({ message: `Document (ID: ${docId}) added or updated in radish-api` });
});

export default router;
