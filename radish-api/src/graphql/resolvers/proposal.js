import { uuid } from 'uuidv4';
import {
  getProposalById,
  getProposalsByRFPId,
  getAllProposals,
  saveProposal,
} from '../../db/models/modules/msa/proposals';
import { pubsub } from '../subscriptions';
import { saveNotice } from '../../db/models/baseline/notices';
import { getPartnerByIdentity } from '../../db/models/baseline/organizations';

const NEW_PROPOSAL = 'NEW_PROPOSAL';

export default {
  Query: {
    proposal(_parent, args) {
      return getProposalById(args.id).then(res => res);
    },
    getProposalsByRFPId(_parent, args) {
      return getProposalsByRFPId(args.rfpId).then(res => res);
    },
    proposals() {
      return getAllProposals();
    },
  },
  Mutation: {
    createProposal: async (_parent, args, context) => {
      // TODO: Connect this to the new baseline function 'createProposal'
      const { recipient, ...input } = args.input;
      const currentUser = await getPartnerByIdentity(context.identity);
      input._id = uuid();
      input.sender = context.identity;
      const newProposal = await saveProposal(input);
      const proposal = newProposal.ops[0];
      await saveNotice({
        resolved: false,
        category: 'proposal',
        subject: `New Proposal: for RFP ${proposal.rfpId}`,
        from: currentUser.name,
        statusText: 'Pending',
        status: 'outgoing',
        categoryId: proposal.rfpId,
        lastModified: Math.floor(Date.now() / 1000),
      });
      pubsub.publish(NEW_PROPOSAL, { newProposal: proposal });
      proposal.type = 'proposal_create';
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
