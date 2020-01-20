import {
  getProposalById,
  getProposalByRFPId,
  getAllProposals,
  saveProposal,
} from '../services/proposal';
import { pubsub } from '../subscriptions';
import { saveNotice } from '../services/notice';

const NEW_PROPOSAL = 'NEW_PROPOSAL';

export default {
  Query: {
    proposal(_parent, args) {
      return getProposalById(args.id).then(res => res);
    },
    getProposalByRFPId(_parent, args) {
      return getProposalByRFPId(args.rfpId).then(res => res);
    },
    proposals() {
      return getAllProposals();
    },
  },
  Mutation: {
    createProposal: async (_parent, args) => {
      const newProposal = await saveProposal(args.input);
      const proposal = newProposal.ops[0];
      await saveNotice({
        resolved: false,
        category: 'proposal',
        subject: `New Proposal: for RFP ${proposal.rfpId}`,
        from: 'Supplier',
        statusText: 'Pending',
        status: 'outgoing',
        categoryId: proposal._id,
        lastModified: new Date(Date.now()),
      });
      pubsub.publish(NEW_PROPOSAL, { newProposal: proposal });
      return { ...proposal };
    },
  },
  Subscription: {
    newProposal: {
      subscribe: () => {
        return pubsub.asyncIterator(NEW_PROPOSAL);
      },
    },
  },
};
