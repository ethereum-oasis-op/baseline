import { ApolloServer } from 'apollo-server';
import coreQuery from './schemas/core';
import OrganizationSchema from './schemas/organization';
import OrganizationResolver from './resolvers/organization';
import ScalarsResolver from './resolvers/scalars';
import ScalarsSchema from './schemas/scalars';

export default function startServer() {
  const typeDefs = [OrganizationSchema, ScalarsSchema];
  const resolvers = [OrganizationResolver, ScalarsResolver];
  const server = new ApolloServer({
    typeDefs: [coreQuery, ...typeDefs],
    resolvers,
  });

  server.listen(80).then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
  });
}
