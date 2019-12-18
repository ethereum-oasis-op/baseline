import express from 'express';
import { createServer } from 'http';
import { ApolloServer } from 'apollo-server-express';
import coreQuery from './schemas/core';
import OrganizationSchema from './schemas/organization';
import OrganizationResolver from './resolvers/organization';
import ScalarsSchema from './schemas/scalars';
import ScalarsResolver from './resolvers/scalars';
import ServerStatusSchema from './schemas/serverStatus';
import ServerStatusResolver from './resolvers/serverStatus';
import ServerStateSchema from './schemas/serverState';
import ServerStateResolver from './resolvers/serverState';
import ServerSettingsSchema from './schemas/serverSettings';
import ServerSettingsResolver from './resolvers/serverSettings';
import PartnerSchema from './schemas/partner';
import PartnerResolver from './resolvers/partner';
import RFPSchema from './schemas/rfp';
import RFPResolver from './resolvers/rfp';
import MessageSchema from './schemas/message';
import MessageResolver from './resolvers/message';
import ContractSchema from './schemas/contract';
import ContractResolver from './resolvers/contract';
import WalletSchema from './schemas/wallet';
import WalletResolver from './resolvers/wallet';
import healthcheck from './install/healthcheck';
import ProposalSchema from './schemas/proposal';
import ProposalResolver from './resolvers/proposal';

const PORT = process.env.PORT || 8001;

const typeDefs = [
  OrganizationSchema,
  ServerStatusSchema,
  ScalarsSchema,
  ServerStateSchema,
  ServerSettingsSchema,
  RFPSchema,
  PartnerSchema,
  MessageSchema,
  ContractSchema,
  WalletSchema,
  ProposalSchema,
];
const resolvers = [
  OrganizationResolver,
  ServerStatusResolver,
  ScalarsResolver,
  ServerStateResolver,
  ServerSettingsResolver,
  RFPResolver,
  PartnerResolver,
  MessageResolver,
  ContractResolver,
  WalletResolver,
  ProposalResolver,
];

export default async function startServer() {
  const app = express();
  await healthcheck();

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
