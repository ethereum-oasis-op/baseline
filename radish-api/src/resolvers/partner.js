import db from '../db';

const PARTNERS_UPDATE = 'PARTNERS_UPDATE';

const getPartnerByID = async address => {
  const partner = await db.collection('organization').findOne({ address: address });
  return partner;
};

export const getPartnerByIdentity = async identity => {
  const partner = await db.collection('organization').findOne({ identity });
  return partner;
}

const getAllPartners = async () => {
  const organizations = await db
    .collection('organization')
    .find({})
    .toArray();
  return organizations;
};

const getMyPartners = async () => {
  const partners = await db
    .collection('partner')
    .find({})
    .toArray();
  return partners;
};

const savePartner = async input => {
  const partner = await db
    .collection('partner')
    .updateOne({ _id: input.address }, { $set: input }, { upsert: true });
  return partner;
};

const deletePartner = async input => {
  const partner = await db.collection('partner').deleteOne({ _id: input.address });
  return partner;
};

export default {
  Query: {
    partner(_parent, args) {
      return getPartnerByID(args.address).then(res => res);
    },
    getPartnerByIdentity(_parent, args) {
      return getPartnerByIdentity(args.identity).then(res => res);
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
