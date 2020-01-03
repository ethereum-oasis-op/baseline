import mongoose from 'mongoose';
import db from '../db';

const RFPSchema = new mongoose.Schema({
  _id: {
    type: String,
    lowercase: true,
    trim: true,
  },
  uuid: {
    type: String,
    required: true,
    // Globally unique across all RFP's (uuid V4)
  },
  name: {
    type: String,
    // For user reference. Likely generated from RFP details
  },
  item: {
    sku: String, // Manufacturer/Idustry unique SKU number
    name: String, // Human readable product name
  },
  estimatedQty: {
    amount: Number, // The number of units
    unit: String, // The unit of measure
  },
  recipients: [
    {
      supplierId: String, // Messenger Id of partner
      receiptDate: Number, // Date of confirmed receipt
    }
  ],
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
  createdDate: Number, // Epoch create date of the RFP object
  publishDate: Number, // Epoch date when first published
  closedDate: Number,	// Epoch date when RFP was closed
},
  {
    collection: 'RFPs',
    versionKey: false,
  });

const RFP = mongoose.model('RFPs', RFPSchema);

/**
 * When a user on the current API generates a new RFP
 */
export const onCreateRFP = async (doc) => {
  // 1.) Token Contract Catalog gets called (Blockchain)
  // 2.) Create proof for RFP object
  // 3.) Iterate over the suppliers and send out a whisper message for each of them (Whisper)
  //     sending: rfp object, smart contract object (rfpAddress, txHash) (verifyingKey, verifyingAddress, proof)
  // 4.) Save current RFP to local db (Mongo) - Sets state to 'pending'
  let newRFP = doc;
  const count = await RFP.estimatedDocumentCount();
  newRFP._id = count + 1;
  const result = await RFP.create([newRFP], { upsert: true, new: true });
  return result._id;
};

/**
 * When a user on a Partners API generates a new RFP (Whisper?)
 */
export const partnerCreateRFP = async (doc) => {
  // 1.) Checks blockchain txHash for the RFP and compares it with the hashed content from Buyer
  // 2.) Save RFP to local db
  let newRFP = doc;
  const count = await RFP.estimatedDocumentCount();
  newRFP._id = count + 1;
  const result = await RFP.create([newRFP], { upsert: true, new: true });
  // 3.) Check blockchain for verifying the zkp information sent by buyer
  // 4.) Notify this user of a new RFP
  return result[0]._id;
};

/**
 * When a user on a Partners API updates a RFP (Whisper?)
 */
export const partnerUpdateRFP = async (doc) => {
  // Gets notified of a new RFP
  // 1.) Checks blockchain txHash for the RFP and compares it with the hashed content from Buyer
  // 2.) Save RFP to local db
  const result = await RFP.findOneAndUpdate({ 'uuid': doc.uuid }, { doc }, { upsert: false, new: true });
  // 3.) Check blockchain for verifying the zkp information sent by buyer
  return result._id;
};

export const whisperListener = event => {
  // Waiting for some sort of whisper response
  // 1.) Whisper message comes in from onCreateRFP(2);
  // 2.) Check local db for RFP state
};
