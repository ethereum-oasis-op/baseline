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
    partner(address: String!): Partner,
    partners: [Partner]
  }

  """
  A type that describes a partner
  """
  type Partner {
    "The partner's name"
    name: String,
    "the partner's ethereum address"
    address: String,
  }
`;
exports.typeDef = typeDef;

const getPartnerByID = async address => {
  const partner = await _db.default.collection('partners').find({
    address: address
  }).toArray();
  return partner;
};

const getAllPartners = async () => {
  const partners = await _db.default.collection('partners').find({}).toArray();
  return partners;
};

const resolvers = {
  Query: {
    partner(parent, args, context, info) {
      return getPartnerByID(args.address).then(res => res[0]);
    },

    partners(parent, args, context, info) {
      return getAllPartners();
    }

  },
  Partner: {
    name: root => root.name,
    address: root => root.address
  }
};
exports.resolvers = resolvers;