import {
  getPartnerByAddress,
  getPartnerByMessengerKey,
  getAllPartners,
  getMyPartners,
  savePartner,
  deletePartner,
} from '../services/partner';

const PARTNERS_UPDATE = 'PARTNERS_UPDATE';

export default {
  Query: {
    async partner(_parent, args) {
      const { address } = args;
      const res = await getPartnerByAddress(address);
      return res;
    },
    async getPartnerByMessengerKey(_parent, args) {
      const { identity } = args;
      const res = await getPartnerByMessengerKey(identity);
      return res;
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
      const { input } = args;
      await savePartner(input);
      const partners = await getMyPartners();
      return partners;
    },
    removePartner: async (_parent, args) => {
      const { input } = args;
      await deletePartner(input);
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
