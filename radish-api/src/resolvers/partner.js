import db from '../db';

const getPartnerByID = async address => {
  const partner = await db.collection('organization').findOne({ address: address });
  return partner;
};

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
    partner(args) {
      return getPartnerByID(args.address).then(res => res);
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
};
