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
exports.typeDef = typeDef;

const getRFQByID = async id => {
  const rfq = await _db.default.collection('rfqs').find({
    _id: id
  }).toArray();
  return rfq;
};

const getAllRFQs = async () => {
  const rfqs = await _db.default.collection('rfqs').find({}).toArray();
  return rfqs;
};

const resolvers = {
  Query: {
    rfq(parent, args, context, info) {
      return getRFQByID(args.address).then(res => res[0]);
    },

    rfqs(parent, args, context, info) {
      return getAllRFQs();
    }

  },
  RFQ: {
    skus: root => root.skus
  }
};
exports.resolvers = resolvers;