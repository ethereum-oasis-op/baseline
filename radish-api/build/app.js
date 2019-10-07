"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.startServer = void 0;

var _apolloServer = require("apollo-server");

var _partner = require("./schemas/partner");

var _sku = require("./schemas/sku");

var _rfq = require("./schemas/rfq");

const Query = `
  type Query {
    _empty: String
  }
`;

const startServer = () => {
  const typeDefs = [Query, _partner.typeDef, _sku.typeDef, _rfq.typeDef];
  const resolvers = [_partner.resolvers, _sku.resolvers, _rfq.resolvers];
  const server = new _apolloServer.ApolloServer({
    typeDefs,
    resolvers
  });
  server.listen(80).then(({
    url
  }) => {
    console.log(`🚀 Server ready at ${url}`);
  });
};

exports.startServer = startServer;