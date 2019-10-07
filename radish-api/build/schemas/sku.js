"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resolvers = exports.typeDef = void 0;

var _db = _interopRequireDefault(require("../db"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
  query($address: String!){
    partner(address: $address) {
      address
      name
    }
  }
 */
const typeDef = `
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
exports.typeDef = typeDef;

const getSKUByID = async id => {
  const sku = await _db.default.collection('skus').find({
    sku: id
  }).toArray();
  return sku;
};

const getAllSKUs = async () => {
  const skus = await _db.default.collection('skus').find({}).toArray();
  return skus;
};

const resolvers = {
  Query: {
    sku(parent, args, context, info) {
      return getSKUByID(args.sku).then(res => res[0]);
    },

    skus(parent, args, context, info) {
      return getAllSKUs();
    }

  },
  SKU: {// name: (root) => root.name,
  }
};
exports.resolvers = resolvers;