import { uuid } from 'uuidv4';
import mongoose from 'mongoose';
import { getOrganizationServerSetting } from '../../baseline/server/settings';

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
  createdDate: Number,
});

const Proposal = mongoose.model('proposals', ProposalSchema);

export const getProposalById = async id => {
  const proposals = await Proposal.findOne({ _id: id });
  return proposals._doc;
};

export const getProposalsByRFPId = async rfpId => {
  const proposals = await Proposal.find({ rfpId });
  return proposals;
};

export const getProposalBbyRFPIdForSupplier = async (rfpId, supplierId) => {
  const proposal = await Proposal.findOne({ rfpId, sender: supplierId });
  console.log('PROPOSAL ------------------------------------------------------------');
  console.log('---------------------------------------------------------------------');
  console.log('---------------------------------------------------------------------');
  console.log(proposal);
  console.log('---------------------------------------------------------------------');
  console.log('---------------------------------------------------------------------');
  return proposal;
};

export const getAllProposals = async () => {
  const proposals = await Proposal.find({});
  return proposals;
};

export const saveProposal = async input => {
  const currentIdentity = await getOrganizationServerSetting('messengerKey');
  const meta = {
    createdDate: Math.floor(Date.now() / 1000),
    sender: input.sender ? input.sender : currentIdentity,
    _id: uuid(),
  };

  console.log('=============================================== SAVING THE PROPOSAL');
  console.log({ meta, input });
  const proposal = await Proposal.create({ ...input, ...meta });
  return proposal;
};

export default {
  getProposalById,
  getProposalsByRFPId,
  getAllProposals,
  saveProposal,
};
