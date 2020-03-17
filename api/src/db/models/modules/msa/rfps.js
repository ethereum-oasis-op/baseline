import mongoose from 'mongoose';
import { getServerSetting, getOrganizationServerSetting } from '../../baseline/server/settings';
import { getMessageDeliveredDate } from '../../baseline/baselineTaskGroup';

const RFPSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      // For user reference. Likely generated from RFP details
    },
    sku: String, // Manufacturer/Industry unique SKU number
    skuDescription: String, // Human readable product name
    recipients: [String], // Messenger Identities for each recipient
    sender: String, // Messenger ID of RFP creator
    proposalDeadline: Number, // Epoch of when responses from recipients are due
    createdDate: Number, // Epoch create date of the RFP object
    publishDate: Number, // Epoch date when first published
    closedDate: Number, // Epoch date when RFP was closed
  },
  {
    collection: 'RFPs',
    versionKey: false,
    toObject: { virtuals: true },
  },
);

RFPSchema.virtual('suppliers', {
  ref: 'organizations', // The model to use
  localField: 'recipients', // Find people where `localField`
  foreignField: 'identity', // is equal to `foreignField`
  // If `justOne` is true, 'members' will be a single doc as opposed to
  // an array. `justOne` is false by default.
  justOne: false,
  // options: { sort: { name: -1 }, limit: 5 } // Query options, see http://bit.ly/mongoose-query-options
});

RFPSchema.virtual('proposals', {
  ref: 'proposals', // The model to use
  localField: '_id', // Find people where `localField`
  foreignField: 'rfpId', // is equal to `foreignField`
  // If `justOne` is true, 'members' will be a single doc as opposed to
  // an array. `justOne` is false by default.
  justOne: false,
  // options: { sort: { name: -1 }, limit: 5 } // Query options, see http://bit.ly/mongoose-query-options
});

RFPSchema.virtual('baselineId', {
  ref: 'baselinetaskgroup', // The model to use
  localField: '_id', // Find people where `localField`
  foreignField: 'docId', // is equal to `foreignField`
  // If `justOne` is true, 'members' will be a single doc as opposed to
  // an array. `justOne` is false by default.
  justOne: true,
  // options: { sort: { name: -1 }, limit: 5 } // Query options, see http://bit.ly/mongoose-query-options
});

const RFP = mongoose.model('rfps', RFPSchema);

export const getRFPById = async uuid => {
  const rfp = await RFP.findOne({ _id: uuid });
  console.log('RETURNING THE RFP', rfp);
  return rfp._doc;
};

export const getAllRFPs = async () => {
  const rfps = await RFP.find({});
  return rfps;
};

export const saveRFP = async input => {
  const currentIdentity = await getOrganizationServerSetting('messengerKey');
  const meta = {
    createdDate: Math.floor(Date.now() / 1000),
    sender: currentIdentity,
  };
  const rfp = await RFP.create({ ...meta, ...input });
  return rfp;
};

const verifyRFPSignature = async (signature, doc) => {
  // const docHash = await hash(doc, { algorithm: 'sha256' });
  // TODO: Need to get public key from sender from somewhere
  // const isVerified = await verify('123456', docHash, signature);
  return true;
};

/**
 * Set the receivedDate and Message Id for the local documents 'signature' field
 * on the receiver side.
 */
export const signatureReceivedUpdate = async (messageId, senderId, rfpId) => {
  const currentTime = Math.floor(Date.now() / 1000);
  const signature = {
    messageId,
    receivedDate: currentTime,
  };
  console.log(`Updating RFP ${rfpId} document with signature field`, signature);
  console.log('Sender Id', senderId);

  const result = await RFP.findOneAndUpdate(
    { _id: rfpId, 'recipients.partner.identity': senderId },
    { $set: { 'recipients.$.signature': signature } },
    { upsert: false, new: true },
  );
  console.log('Update result', result);
  return result;
};

/**
 * Set the sentDate and Message for the local documents 'signature' field
 * on the sender side
 */
export const signatureSentUpdate = async (messageId, myId, rfpId) => {
  const currentTime = Math.floor(Date.now() / 1000);
  const signature = {
    messageId,
    sentDate: currentTime,
  };
  console.log(`Updating RFP ${rfpId} document with signature field`, signature);
  console.log('My Id', myId);
  // Finding my Id as it appears in the document sent to me by the sender
  // The sender created this 'partner' ID for me, when they generated the
  // document on their system.
  const result = await RFP.findOneAndUpdate(
    { _id: rfpId, 'recipients.partner.identity': myId },
    { $set: { 'recipients.$.signature': signature } },
    { upsert: false, new: true },
  );
  console.log('Update result', result);
  return result;
};

/**
 * Signs and enqueue delivery for the RFP document
 * @param {Object} doc - The Document to sign
 */
const signAndReturnRFP = async doc => {
  console.log('About to sign RFP');
  const config = await getServerSettings();
  console.log('Got server settings', config);
  const docHash = hash(doc, { algorithm: 'sha256' });
  console.log('Got RFP Hash to sign', docHash);
  const signature = await sign(docHash);
  console.log('Created signature', signature);
  // Package up signature in payload
  const payload = {
    signature,
    type: 'rfp_signature',
    rfpId: doc._id,
    method: 'EdDSA',
  };
  console.log('Signature payload ready', JSON.stringify(payload));
  // Put on message delivery queue to go out
  sigDeliveryQueue.add(
    {
      documentId: doc._id,
      senderId: config.organizationWhisperKey,
      recipientId: doc.sender,
      payload,
    },
    {
      // Mark job as failed after 20sec so subsequent jobs are not stalled
      timeout: 20000,
    },
  );
  console.log('Signed RFP and enqueued it', doc._id);
};

/**
 * Handles inbound call from the supplier with the signed RFP object.
 * Pulls out the payload components, validates the signature, and kicks off
 * the next part of the Baseline process (ie generating the proofs, etc...)
 * @param {Object} payload - the payload object from the supplier
 */
export const partnerSignedRfp = async payload => {
  // get payload, pull out the document id
  const { signature, rfpId, messageId, senderId } = payload;
  // Get the rfp
  const rfp = await getRFPById(rfpId);
  // verify the signature
  if (await verifyRFPSignature(signature, rfp)) {
    // update the rfp with the signature info from the supplier
    const result = await signatureReceivedUpdate(messageId, senderId, rfpId);
    // Enqueue the next workflow processing stage
    console.log('Signature saving result', result);
  } else {
    // Do something about the failed signature check
  }
};

/**
 * When a user on a Partners API generates a new RFP (Whisper?)
 */
export const partnerCreateRFP = async doc => {
  // 1.) Checks blockchain txHash for the RFP and compares it with the hashed content from Buyer
  // 2.) Save RFP to local db
  const newRFP = doc;
  newRFP._id = doc.uuid;
  console.log(`Saving new RFP (uuid: ${doc.uuid}) from partner...`);
  const result = await RFP.create([newRFP], { upsert: true, new: true });
  await createNotice('rfp', result[0]);
  console.log('Got RFP as supplier');
  // Deliver signed RFP document to back sender
  await signAndReturnRFP(doc);

  return result[0];
};

/**
 * When a partners messenger receives an RFP I sent, it will return a delivery receipt.
 * Update the RFP to show that recipient has received the RFP.
 */
export const deliveryReceiptUpdate = async doc => {
  console.log(`Updating deliveryReceipt date for messageId ${doc.messageId}`);
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

export const getRFPDeliveredDate = async (docId, recipientId) => {
  const deliveredDate = await getMessageDeliveredDate('rfp', docId, recipientId);
  return deliveredDate;
};

export default {
  getRFPById,
  getAllRFPs,
  saveRFP,
  verifyRFPSignature,
  signatureReceivedUpdate,
  signatureSentUpdate,
  signAndReturnRFP,
  partnerSignedRfp,
  partnerCreateRFP,
  deliveryReceiptUpdate,
  originationUpdate,
  partnerUpdateRFP,
  getRFPDeliveredDate,
};
