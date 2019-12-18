import { pubsub } from '../subscriptions';
import db from '../db';
import { saveMessage } from './message';

const NEW_MSA = 'NEW_MSA';

const getMSAById = async id => {
  const msa = await db.collection('msa').findOne({ _id: id });
  return msa;
};

const getMSAByProposalId = async id => {
  const msa = await db.collection('msa').findOne({ proposalId: id });
  return msa;
}

const getAllMSAs = async () => {
  const msas = await db
    .collection('msa')
    .find({})
    .toArray();
  return msas;
};

const saveMSA = async input => {
  const exists = await getMSAByProposalId(input.proposalId);
  if (exists) throw new Error(`MSA already exists for Proposal ${input.proposalId}`);
  const count = await db.collection('msa').count({});
  const doc = Object.assign(input, { _id: count + 1 });
  const msa = await db.collection('msa').insert(doc);
  return msa;
};

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
