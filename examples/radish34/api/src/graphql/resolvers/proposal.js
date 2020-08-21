import { uuid } from 'uuidv4';
import {
  getProposalById,
  getProposalsByRFPId,
  getAllProposals,
  saveProposal,
  getProposalByRFPAndSupplier
} from '../../services/proposal';
import { pubsub } from '../subscriptions';
import { saveNotice } from '../../services/notice';
import { getPartnerByMessagingKey } from '../../services/partner';
import msgDeliveryQueue from '../../queues/message_delivery';

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
    getProposalByRFPAndSupplier(_parent, args) {
      return getProposalByRFPAndSupplier({ sender: args.sender, rfpId: args.rfpId });
    }
  },
  Mutation: {
    createProposal: async (_parent, args, context) => {
      const { recipient, ...input } = args.input;
      console.log('---------- proposal args.input:', args.input)
      console.log('---------- recipient:', recipient)
      console.log('---------- context:', context.identity)
      const currentUser = await getPartnerByMessagingKey(context.identity);
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
      msgDeliveryQueue.add(
        {
          documentId: proposal._id,
          senderId: context.identity,
          recipientId: recipient,
          payload: proposal,
        },
        {
          // Mark job as failed after 20sec so subsequent jobs are not stalled
          timeout: 20000,
        },
      );
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
