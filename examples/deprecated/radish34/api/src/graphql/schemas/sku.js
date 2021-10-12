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
    sku(sku: Int!): SKU
    skus: [SKU]
  }

  type SKU {
    sku: String,
    name: String,
    dimensions: String,
    weight: String,
    volume: String,
    packaging: String,
  }
`;

const getSKUByID = async id => {
  const sku = await db
    .collection('skus')
    .find({ sku: id })
    .toArray();
  return sku;
};

const getAllSKUs = async () => {
  const skus = await db
    .collection('skus')
    .find({})
    .toArray();
  return skus;
};

export const resolvers = {
  Query: {
    sku(args) {
      return getSKUByID(args.sku).then(res => res[0]);
    },
    skus() {
      return getAllSKUs();
    },
  },
  SKU: {
    // name: (root) => root.name,
  },
};
