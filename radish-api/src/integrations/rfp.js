import db from '../db';

// RFP Schema
/*
{
	uuid: 			String - Globally unique across all RFP's (uuid V4)
	name:				String - For user reference. Likely generated from RFP details
	item:
	{
		sku: 			String - Manufacturer/Idustry unique SKU number
		name: 		String - Human readable product name
	},
	estimatedQty: {
		amount: 		Int - The number of units
		unit: 			String/ENUM - The unit of measure
  },
  recipients: {
    [0xsupplier1] : {
      receiptDate: Int - Date of confirmed receipt
    },
    [0xsupplier2] : {
      receiptDate: Int - Date of confirmed receipt
    },
    [0xsupplier3] : {
      receiptDate: Int - Date of confirmed receipt
    },
  },
	onchainAttrs: {
		rfpAddress:   String - address of the registry contract for this RFP object
		txHash: 		String - the origination transaction (first created onchain)
		rfpId: 		Int - The immutable anonymous token ID for this RFP object
	},
  zkpAttrs: {
    proof:           String - ID of the proving object
    verificationKey: String - Key used for on-chain verification by verifier contract
    verifierABI:    String - base64 encoded binary ABI for the verifier contract
  }
	createdDate: 		Int - Epoch create date of the RFP object
  publishDate:		Int - Epoch date when first published
	closedDate:		    Int - Epoch date when RFP was closed
}
*/

/**
 * When a user on the current API generates a new RFP
 */
export const onCreateRFP = ({ description, sku, deliveryDate, suppliers }) => {
  // 1.) Token Contract Catalog gets called (Blockchain)
  // *.) Create proof for RFP object
  // 2.) Iterate over the suppliers and send out a whisper message for each of them (Whisper)
  //     sending: rfp object, smart contract object (rfpAddress, txHash) (verifyingKey, verifyingAddress, proof)
  // 3.) Save current RFP to local db (Mongo) - Sets state to 'pending'
};

/**
 * When a user on a Partners API generates a new RFP (Whisper?)
 */
export const partnerCreateRFP = async (doc) => {
  // Gets notified of a new RFP
  // 1.) Checks blockchain txHash for the RFP and compares it with the hashed content from Buyer
  // 2.) Save RFP to local db
  const rfp = await db.collection('rfp').insertOne(doc);
  // *.) Check blockchain for verifying the zkp information sent by buyer
  return rfp.insertedId;
};

/**
 * When a user on a Partners API updates a RFP (Whisper?)
 */
export const updateRFP = async (doc) => {
  // Gets notified of a new RFP
  // 1.) Checks blockchain txHash for the RFP and compares it with the hashed content from Buyer
  // 2.) Save RFP to local db
  // *.) Check blockchain for verifying the zkp information sent by buyer
  const rfp = await db.collection('rfp').update({ 'uuid': doc.uuid },
    { $set: doc });
  return rfp;
};

export const whisperListener = event => {
  // Waiting for some sort of whisper response
  // 1.) Whisper message comes in from onCreateRFP(2);
  // 2.) Check local db for RFP state
};
