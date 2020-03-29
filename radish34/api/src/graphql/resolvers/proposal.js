import { uuid } from 'uuidv4';
import {
  getProposalById,
  getProposalByRFPId,
  getAllProposals,
  saveProposal,
} from '../../db/models/modules/proposals';
import { pubsub } from '../subscriptions';
import { saveNotice } from '../../db/models/baseline/notices';
import { getPartnerByIdentity } from '../../db/models/baseline/organizations';

const NEW_PROPOSAL = 'NEW_PROPOSAL';

export default {
  Query: {
    async proposal(_parent, args) {
      const { id } = args;
      const res = await getProposalById(id);
      return res;
    },
    async getProposalsByRFPId(_parent, args) {
      const { rfpId } = args;
      const res = await getProposalByRFPId(rfpId);
      return res;
    },
    proposals() {
      return getAllProposals();
    },
  },
  Mutation: {
    createProposal: async (_parent, args, context) => {
      // TODO: Connect this to the new baseline function 'createProposal'
      const { recipient, ...input } = args.input;
      const { identity } = context;
      const currentUser = await getPartnerByIdentity(identity);
      input._id = uuid();
      input.sender = identity;
      const newProposal = await saveProposal(input);
      const proposal = newProposal.ops[0];
      const { rfpId, type } = proposal;
      await saveNotice({
        resolved: false,
        category: 'proposal',
        subject: `New Proposal: for RFP ${rfpId}`,
        from: currentUser.name,
        statusText: 'Pending',
        status: 'outgoing',
        categoryId: proposal.rfpId,
        lastModified: Math.floor(Date.now() / 1000),
      });
      pubsub.publish(NEW_PROPOSAL, { newProposal: proposal });
      type = 'proposal_create';
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
