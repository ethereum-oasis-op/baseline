import mongoose from 'mongoose';
import { createNotice } from '../baseline/notices';

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
  rates: [
    {
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
      },
    },
  ],
  sender: {
    type: String, // Messenger Id of partner
    required: true,
  },
  erc20ContractAddress: {
    type: String,
    required: true,
  },
  recipients: [
    {
      partner: {
        name: String, // Organization name
        address: String, // Ethereum address
        identity: String, // Messenger Id of partner
        role: String, // Organization role within supply chain
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
    },
  ],
});

const Proposal = mongoose.model('proposals', ProposalSchema);

export const getProposalById = async id => {
  const proposals = await Proposal.findOne({ _id: id });
  return proposals;
};

export const getProposalByRFPId = async rfpId => {
  const proposal = await Proposal.findOne({ rfpId });
  return proposal;
};

export const getAllProposals = async () => {
  const proposals = await Proposal.find({}).toArray();
  return proposals;
};

export const saveProposal = async doc => {
  try {
    const { _id } = doc;
    const newProposal = doc;
    newProposal._id = _id;
    const { rfpId } = newProposal;
    console.log(`Saving new Proposal (id: ${_id}) from partner...`);
    const result = await Proposal.create([newProposal], { upsert: true, new: true });
    await createNotice('proposal', result[0], rfpId);
    return result[0];
  } catch (e) {
    console.log('Error creating proposal: ', e);
  }
};

export default {
  getProposalById,
  getProposalByRFPId,
  getAllProposals,
  saveProposal,
};
