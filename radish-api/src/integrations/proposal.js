import mongoose from 'mongoose';
import { createNotice } from './notices';

const ProposalSchema = new mongoose.Schema({
  _id: {
    type: String,
    lowercase: true,
    trim: true,
  },
  rfpId: {
    type: String,
    required: true,
  },
  rates: [{
    _id: false,
    startRange: { 
      type: Number,
      required: true,
    },
    endRange: { 
      type: Number,
      required: true,
    },
    price: { 
      type: Number,
      required: true,
    },
    unitOfMeasure: { 
      type: String,
      required: true,
    }
  }],
  sender: {
    type: String, // Messenger Id of partner
    required: true,
  },
});

const Proposal = mongoose.model('proposals', ProposalSchema);

/**
 * Creates a proposal in the sender of the RFP's db
 * @param {object} doc - the proposal to be sent
 */
export const partnerCreateProposal = async (doc) => {
  // 1.) Checks blockchain txHash for the proposal and compares it with the hashed content from Supplier
  // 2.) Save proposal to local db
  try {
    let newProposal = doc;
    newProposal._id = doc._id;
    console.log(`Saving new Proposal (id: ${doc._id}) from partner...`);
    const result = await Proposal.create([newProposal], { upsert: true, new: true });
    await createNotice('proposal', result[0], newProposal.rfpId);
    return result[0];
  } catch(e) {
    console.log('Error creating proposal: ', e);
  }

  // 3.) Check blockchain for verifying the zkp information sent by buyer
  // 4.) Notify this user of a new proposal
};
