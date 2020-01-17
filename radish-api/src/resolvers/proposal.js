import { pubsub } from '../subscriptions';
import db from '../db';
import { saveMessage } from './message';

const NEW_PROPOSAL = 'NEW_PROPOSAL';

const getProposalById = async id => {
  const proposals = await db.collection('proposal').findOne({ _id: id });
  return proposals;
};

const getProposalByRFPId = async rfpId => {
  const proposal = await db.collection('proposal').findOne({ rfpId });
  return proposal;
}

const getAllProposals = async () => {
  const proposals = await db
    .collection('proposal')
    .find({})
    .toArray();
  return proposals;
};

const saveProposal = async input => {
  const count = await db.collection('proposal').count({});
  const doc = Object.assign(input, { _id: count + 1 });
  const proposal = await db.collection('proposal').insert(doc);
  return proposal;
};

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
      await saveMessage({
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
