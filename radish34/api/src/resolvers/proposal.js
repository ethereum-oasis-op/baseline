import { uuid } from 'uuidv4';
import {
  getProposalById,
  getProposalsByRFPId,
  getAllProposals,
  saveProposal,
  getProposalByRFPAndSupplier
} from '../services/proposal';
import { pubsub } from '../subscriptions';
import { saveNotice } from '../services/notice';
import { getPartnerByMessengerKey } from '../services/partner';
import msgDeliveryQueue from '../queues/message_delivery';

const NEW_PROPOSAL = 'NEW_PROPOSAL';

export default {
  Query: {
    async proposal(_parent, args) {
      const res = await getProposalById(args.id);
      return res;
    },
    async getProposalsByRFPId(_parent, args) {
      const res = await getProposalsByRFPId(args.rfpId);
      return res;
    },
    proposals() {
      return getAllProposals();
    },
    getProposalByRFPAndSupplier(_parent, args) {
      const { sender, rfpId } = args;
      return getProposalByRFPAndSupplier({ sender, rfpId });
    }
  },
  Mutation: {
    createProposal: async (_parent, args, context) => {
      const { recipient, ...input } = args.input;
      const currentUser = await getPartnerByMessengerKey(context.identity);
      const { name: userName } = currentUser;
      input._id = uuid();
      input.sender = context.identity;
      const newProposal = await saveProposal(input);
      const proposal = newProposal.ops[0];
      const { rfpId: proposalRfpId, _id: proposalId } = proposal;
      await saveNotice({
        resolved: false,
        category: 'proposal',
        subject: `New Proposal: for RFP ${proposalRfpId}`,
        from: userName,
        statusText: 'Pending',
        status: 'outgoing',
        categoryId: proposalRfpId,
        lastModified: Math.floor(Date.now() / 1000),
      });
      pubsub.publish(NEW_PROPOSAL, { newProposal: proposal });
      proposal.type = 'proposal_create';
      msgDeliveryQueue.add({
        documentId: proposalId,
        senderId: context.identity,
        recipientId: recipient,
        payload: proposal,
      });
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
