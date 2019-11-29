// RFQ Schema
/*
{
	uuid: 			String - Globally unique across all RFQ's (uuid V4)
	name:				String - For user reference. Likely generated from RFQ details
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
		rfqAddress:   String - address of the registry contract for this RFQ object
		txHash: 		String - the origination transaction (first created onchain)
		rfqId: 		Int - The immutable anonymous token ID for this RFQ object
	},
  zkpAttrs: {
    proof:           String - ID of the proving object
    verificationKey: String - Key used for on-chain verification by verifier contract
    verifierABI:    String - base64 encoded binary ABI for the verifier contract
  }
	createdDate: 		Int - Epoch create date of the RFQ object
  publishDate:		Int - Epoch date when first published
	closedDate:		    Int - Epoch date when RFQ was closed
}
*/

/**
 * When a user on the current API generates a new RFQ
 */
export const onCreateRFQ = ({ description, sku, deliveryDate, suppliers }) => {
  // 1.) Token Contract Catalog gets called (Blockchain)
  // *.) Create proof for RFQ object
  // 2.) Iterate over the suppliers and send out a whisper message for each of them (Whisper)
  //     sending: rfq object, smart contract object (rfqAddress, txHash) (verifyingKey, verifyingAddress, proof)
  // 3.) Save current RFQ to local db (Mongo) - Sets state to 'pending'
};

/**
 * When a user on a Partners API generates a new RFQ (Whisper?)
 */
export const onNewRFQ = () => {
  // Gets notified of a new RFQ
  // 1.) Checks blockchain txHash for the RFQ and compares it with the hashed content from Buyer
  // 2.) Save RFQ to local db
  // *.) Check blockchain for verifying the zkp information sent by buyer
};

export const whisperListener = event => {
  // Waiting for some sort of whisper response
  // 1.) Whisper message comes in from onCreateRFQ(2);
  // 2.) Check local db for RFQ state
};
