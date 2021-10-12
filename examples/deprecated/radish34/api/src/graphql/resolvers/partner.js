import {
  getPartnerByAddress,
  getPartnerByMessagingKey,
  getAllPartners,
  getMyPartners,
  savePartner,
  deletePartner,
} from '../../services/partner';

const PARTNERS_UPDATE = 'PARTNERS_UPDATE';

export default {
  Query: {
    partner(_parent, args) {
      return getPartnerByAddress(args.address).then(res => res);
    },
    getPartnerByMessagingKey(_parent, args) {
      return getPartnerByMessagingKey(args.identity).then(res => res);
    },
    partners() {
      return getAllPartners();
    },
    myPartners() {
      return getMyPartners();
    },
  },
  Partner: {
    name: root => root.name,
    address: root => root.address,
    role: root => root.role,
  },
  Mutation: {
    addPartner: async (_parent, args) => {
      await savePartner(args.input);
      const partners = await getMyPartners();
      return partners;
    },
    removePartner: async (_parent, args) => {
      await deletePartner(args.input);
      const partners = await getMyPartners();
      return partners;
    },
  },
  Subscription: {
    getPartnerUpdate: {
      subscribe: () => {
        return pubsub.asyncIterator(PARTNERS_UPDATE);
      },
    },
  },
};
