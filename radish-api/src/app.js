import { createServer } from 'http';
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import { UI } from 'bull-board';
import bodyParser from 'body-parser';
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
import MSASchema from './schemas/msa';
import MSAResolver from './resolvers/msa';

import messageRoutes from './routes/messenger';
import healthRoutes from './routes/healthCheck';

const GRAPHQL_PORT = process.env.GRAPHQL_PORT || 8001;
const REST_PORT = process.env.REST_PORT || 8101;

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
  MSASchema,
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
  MSAResolver,
];

export default async function startServer() {
  const app = express();

  app.use(bodyParser.json({ limit: '2mb' }));
  app.use('/api/v1', messageRoutes);
  app.use('/api/v1', healthRoutes);
  app.use('/bulls', UI);

  app.listen(REST_PORT, () =>
    console.log(`🚀 Internal REST-Express server listening at http://localhost:${REST_PORT}`),
  );
  await healthcheck();

  const server = new ApolloServer({
    typeDefs: [coreQuery, ...typeDefs],
    resolvers,
  });
  server.applyMiddleware({ app, path: '/graphql' });

  const httpServer = createServer(app);
  server.installSubscriptionHandlers(httpServer);

  // Spin up workers

  httpServer.listen({ port: GRAPHQL_PORT }, () => {
    console.log(`🚀 Server ready at http://localhost:${GRAPHQL_PORT}${server.graphqlPath}`);
    console.log(
      `🚀 Subscriptions ready at ws://localhost:${GRAPHQL_PORT}${server.subscriptionsPath}`,
    );
  });
}
