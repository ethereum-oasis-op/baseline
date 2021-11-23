import mongoose from 'mongoose';
import { uuid } from 'uuidv4';
import { createNotice } from '../baseline/notices';
import { logger } from 'radish34-logger';

const RFPSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      lowercase: true,
      trim: true,
      // Globally unique across all RFP's (uuid V4)
    },
    description: {
      type: String,
      // For user reference. Likely generated from RFP details
    },
    sku: String, // Manufacturer/Industry unique SKU number
    skuDescription: String, // Human readable product name
    recipients: [
      {
        partner: {
          name: String, // Organization name
          address: String, // Ethereum address
          identity: String, // Messenger Id of partner
          role: String, // Organization role within supply chain
        },
        onchainAttrs: {
          rfpAddress: String, // address of the registry contract for this RFP object
          txHash: String, // the origination transaction (first created onchain)
          rfpId: Number, // The immutable anonymous token ID for this RFP object
        },
        zkpAttrs: {
          proof: String, // ID of the proving object
          verificationKey: String, // Key used for on-chain verification by verifier contract
          verifierABI: String, // base64 encoded binary ABI for the verifier contract
        },
        origination: {
          // Filled by buyer
          receiptDate: Number, // Date of confirmed receipt
          messageId: String, // Hash of message used to send RFP via messenger service
        },
        signature: {
          // Filled by buyer/supplier
          sentDate: Number, // Supplier fills: Date Supplier sent signature
          receivedDate: Number, // Buyer fills: Date of confirmed receipt of valid sig
          messageId: String, // Buyer/Supplier fills: Hash of message used to send/received RFP via messenger service
        },
        baseline: {
          // Filled by buyer
          receiptDate: Number, // Date of confirmed receipt
          messageId: String, // Hash of message used to send RFP via messenger service
        },
        verification: {
          // Filled by supplier
          receiptDate: Number, // Date of confirmed receipt
          messageId: String, // Hash of message used to send RFP via messenger service
        },
      },
    ],
    sender: String, // Messenger ID of RFP creator
    proposalDeadline: Number, // Epoch of when responses from recipients are due
    createdDate: Number, // Epoch create date of the RFP object
    publishDate: Number, // Epoch date when first published
    closedDate: Number, // Epoch date when RFP was closed
  },
  {
    collection: 'RFPs',
    versionKey: false,
  },
);

const RFP = mongoose.model('rfps', RFPSchema);

export const getRFPById = async uuid => {
  const rfp = await RFP.findOne({ _id: uuid });
  return rfp;
};

export const getAllRFPs = async () => {
  const rfps = await RFP.find({}).toArray();
  return rfps;
};

export const saveRFP = async doc => {
  const newRFP = doc;
  newRFP._id = await uuid();
  logger.info(`Saving new RFP with uuid ${newRFP._id} ...`, { service: 'API' });
  const result = await RFP.create([newRFP], { upsert: true, new: true });
  return result[0];
};

/**
 * When a user on a Partners API generates a new RFP (Whisper?)
 */
export const partnerCreateRFP = async doc => {
  // 1.) Checks blockchain txHash for the RFP and compares it with the hashed content from Buyer
  // 2.) Save RFP to local db
  const newRFP = doc;
  newRFP._id = doc.uuid;
  logger.info(`Saving new RFP with uuid ${doc.uuid} from partner ...`, { service: 'API' });
  const result = await RFP.create([newRFP], { upsert: true, new: true });
  await createNotice('rfp', result[0]);
  logger.info('Got RFP as supplier.', { service: 'API' });

  return result[0];
};

/**
 * When a partners messenger receives an RFP I sent, it will return a delivery receipt.
 * Update the RFP to show that recipient has received the RFP.
 */
export const deliveryReceiptUpdate = async doc => {
  logger.info(`Updating deliveryReceipt date for messageId ${doc.messageId}.\n%o`, doc, { service: 'API' });
  const result = await RFP.findOneAndUpdate(
    { 'recipients.origination.messageId': doc.messageId },
    { $set: { 'recipients.$.origination.receiptDate': doc.deliveredDate } },
    { upsert: false, new: true },
  );
  return result;
};

/**
 * Set the messageId for a recipient's origination object
 */
export const originationUpdate = async (messageId, recipientId, rfpId) => {
  const origination = {
    messageId,
  };
  const result = await RFP.findOneAndUpdate(
    { _id: rfpId, 'recipients.partner.identity': recipientId },
    { $set: { 'recipients.$.origination': origination } },
    { upsert: false, new: true },
  );
  return result;
};

/**
 * When a user on a Partners API updates a RFP (Whisper?)
 */
export const partnerUpdateRFP = async doc => {
  // Gets notified of a new RFP
  // 1.) Checks blockchain txHash for the RFP and compares it with the hashed content from Buyer
  // 2.) Save RFP to local db
  const result = await RFP.findOneAndUpdate(
    { _id: doc.uuid },
    { doc },
    { upsert: false, new: true },
  );
  // 3.) Check blockchain for verifying the zkp information sent by buyer
  return result;
};

export default {
  getRFPById,
  getAllRFPs,
  saveRFP,
  partnerCreateRFP,
  deliveryReceiptUpdate,
  originationUpdate,
  partnerUpdateRFP,
};
