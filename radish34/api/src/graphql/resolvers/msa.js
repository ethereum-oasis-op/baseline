import { getMSAById, getAllMSAs, getMSAByProposalId, saveMSA } from '../../db/models/modules/msa';
import { pubsub } from '../subscriptions';
import { saveNotice } from '../../db/models/baseline/notices';

const NEW_MSA = 'NEW_MSA';

export default {
  Query: {
    async msa(_parent, args) {
      const res = await getMSAById(args.id);
      return res;
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
      const { proposalId, _id } = msa;
      await saveNotice({
        resolved: false,
        category: 'msa',
        subject: `MSA established for proposal ${proposalId}`,
        from: 'Buyer',
        statusText: 'Active',
        status: 'outgoing',
        categoryId: _id,
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
