import {
  getMSAById,
  getAllMSAs,
  getMSAByProposalId,
  saveMSA,
} from '../../db/models/modules/msa/msa';
import { pubsub } from '../subscriptions';
import { saveNotice } from '../../db/models/baseline/notices';

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
      // TODO: Connect this to the new baseline createMSA function
      const newMSA = await saveMSA(args.input);
      const msa = newMSA.ops[0];
      await saveNotice({
        resolved: false,
        category: 'msa',
        subject: `MSA established for proposal ${msa.proposalId}`,
        from: 'Buyer',
        statusText: 'Active',
        status: 'outgoing',
        categoryId: msa._id,
        lastModified: Math.floor(Date.now() / 1000),
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
