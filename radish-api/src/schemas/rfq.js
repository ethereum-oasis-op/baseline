import db from '../db';

/**
  query($address: String!){
    partner(address: $address) {
      address
      name
    }
  }
 */

export const typeDef = `
  extend type Query {
    rfq(id: Int!): RFQ,
    rfqs: [RFQ]
  }

  """
  A type that describes an RFQ
  """
  type RFQ {
    sentBy: String,
    sentDate: String,
    neededBy: String,
    supplier: String,
    skus: [SKU]
  }
`;

const getRFQByID = async (id) => {
  const rfq = await db
    .collection('rfqs')
    .find({ _id: id })
    .toArray();
  return rfq;
}

const getAllRFQs = async () => {
  const rfqs = await db
  .collection('rfqs')
  .find({})
  .toArray();
  return rfqs;
}

export const resolvers = {
  Query: {
    rfq(parent, args, context, info) {
      return getRFQByID(args.address).then(res => res[0]);
    },
    rfqs(parent, args, context, info) {
      return getAllRFQs();
    }
  },
  RFQ: {
    skus: (root) => root.skus,
  },
};
