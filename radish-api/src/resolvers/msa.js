import {
  getMSAById,
  getAllMSAs,
  getMSAByProposalId,
  saveMSA,
} from '../services/msa';
import { pubsub } from '../subscriptions';
import { saveMessage } from '../services/message';

const NEW_MSA = 'NEW_MSA';

export default {
  Query: {
    msa(_parent, args) {
      return getMSAById(args.id).then(res => res);
    },
    msas() {
      return getAllMSAs();
    },
    msaByProposal(_parent, args) {
      return getMSAByProposalId(args.proposalId);
    },
  },
  Mutation: {
    createMSA: async (_parent, args) => {
      const newMSA = await saveMSA(args.input);
      const msa = newMSA.ops[0];
      await saveMessage({
        resolved: false,
        category: 'msa',
        subject: `MSA established for proposal ${msa.proposalId}`,
        from: 'Buyer',
        statusText: 'Active',
        status: 'outgoing',
        categoryId: msa._id,
        lastModified: new Date(Date.now()),
      });
      pubsub.publish(NEW_MSA, { newMSA: msa });
      return { ...msa };
    },
  },
  Subscription: {
    newMSA: {
      subscribe: () => {
        return pubsub.asyncIterator(NEW_MSA);
      },
    },
  },
};
