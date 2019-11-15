import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import { createServer } from 'http';
import coreQuery from './schemas/core';
import OrganizationSchema from './schemas/organization';
import OrganizationResolver from './resolvers/organization';
import ScalarsResolver from './resolvers/scalars';
import ScalarsSchema from './schemas/scalars';
import PartnerSchema from './schemas/partner';
import PartnerResolver from './resolvers/partner';
import healthcheck from './install/healthcheck';

const PORT = process.env.PORT || 8001;

const typeDefs = [PartnerSchema, OrganizationSchema, ScalarsSchema];
const resolvers = [PartnerResolver, OrganizationResolver, ScalarsResolver];

export default async function startServer() {
  const app = express();
  await healthcheck();

const PORT = process.env.PORT || 8001;

const typeDefs = [PartnerSchema, OrganizationSchema, ScalarsSchema];
const resolvers = [PartnerResolver, OrganizationResolver, ScalarsResolver];

export default async function startServer() {
  const app = express();

  const server = new ApolloServer({
    typeDefs: [coreQuery, ...typeDefs],
    resolvers,
  });
  server.applyMiddleware({ app, path: '/graphql' });

  const httpServer = createServer(app);
  server.installSubscriptionHandlers(httpServer);

  httpServer.listen({ port: PORT }, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
    console.log(`🚀 Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`);
  });
}
