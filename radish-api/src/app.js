import { ApolloServer } from 'apollo-server';
import coreQuery from './schemas/core';
import OrganizationSchema from './schemas/organization';
import OrganizationResolver from './resolvers/organization';
import ScalarsResolver from './resolvers/scalars';
import ScalarsSchema from './schemas/scalars';
import PartnerSchema from './schemas/partner';
import PartnerResolver from './resolvers/partner';

export default function startServer() {
  const typeDefs = [PartnerSchema, OrganizationSchema, ScalarsSchema];
  const resolvers = [PartnerResolver, OrganizationResolver, ScalarsResolver];
  const server = new ApolloServer({
    typeDefs: [coreQuery, ...typeDefs],
    resolvers,
  });

  server.listen(80).then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
  });
}
