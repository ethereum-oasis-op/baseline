import { ApolloServer } from 'apollo-server';

import {
  typeDef as Partner,
  resolvers as partnerResolvers
} from './schemas/partner';

import {
  typeDef as SKU,
  resolvers as SKUResolvers
} from './schemas/sku';

import {
  typeDef as RFQ,
  resolvers as RFQResolvers
} from './schemas/rfq';

const Query = `
  type Query {
    _empty: String
  }
`;

export const startServer = () => {

  const typeDefs = [
    Query,
    Partner,
    SKU,
    RFQ,
  ];

  const resolvers = [
    partnerResolvers,
    SKUResolvers,
    RFQResolvers,
  ]

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  server.listen(80).then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`)
  });
}
