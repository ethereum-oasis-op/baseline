import mongoose from 'mongoose';

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

export const saveProposal = async input => {
  const count = await Proposal.count({});
  const doc = Object.assign(input, { _id: count + 1 });
  const proposal = await Proposal.insert(doc);
  return proposal;
};

export default {
  getProposalById,
  getProposalByRFPId,
  getAllProposals,
  saveProposal,
};
