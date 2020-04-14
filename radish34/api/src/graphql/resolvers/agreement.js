import { getAgreementById, getAllAgreements, getAgreementByLinkedId, saveAgreement } from '../../db/models/modules/agreement';
import { pubsub } from '../subscriptions';
import { saveNotice } from '../../db/models/baseline/notices';

const NEW_AGREEMENT = 'NEW_AGREEMENT';

export default {
  Query: {
    Agreement(_parent, args) {
      return getAgreementById(args.id).then(res => res);
    },
    Agreements() {
      return getAllAgreements();
    },
    AgreementByLinkedId(_parent, args) {
      return getAgreementByLinkedId(args.linkedId);
    },
  },
  Mutation: {
    createAgreement: async (_parent, args) => {
      // TODO: Connect this to the new baseline createMSA function
      const newAgreement = await saveAgreement(args.input);
      const agreement = newAgreement.ops[0];
      await saveNotice({
        resolved: false,
        category: 'agreement',
        subject: `Agreement established for linked ID ${agreement.linkedId}`,
        from: 'Buyer',
        statusText: 'Active',
        status: 'outgoing',
        categoryId: agreement._id,
        lastModified: Math.floor(Date.now() / 1000),
      });
      pubsub.publish(NEW_AGREEMENT, { newAgreement: doc });
      return { ...agreement };
    },
  },
  Subscription: {
    newAgreement: {
      subscribe: () => {
        return pubsub.asyncIterator(NEW_AGREEMENT);
      },
    },
  },
};
