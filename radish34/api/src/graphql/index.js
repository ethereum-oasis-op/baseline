import { createServer } from 'http';
import { ApolloServer } from 'apollo-server-express';
import { getAuthorization } from '../auth';
import { logger } from 'radish34-logger';

// Placeholder schema to allow extensions
import coreQuery from './schemas/core';

// Custom scalars for data types
import ScalarsSchema from './schemas/scalars';
import ScalarsResolver from './resolvers/scalars';

// Collection schemas
import OrganizationSchema from './schemas/organization';
import RFPSchema from './schemas/rfp';
import NoticeSchema from './schemas/notice';
import ContractSchema from './schemas/contract';
import WalletSchema from './schemas/wallet';
import ProposalSchema from './schemas/proposal';
import MSASchema from './schemas/msa';

// Collection resolvers
import OrganizationResolver from './resolvers/organization';
import RFPResolver from './resolvers/rfp';
import NoticeResolver from './resolvers/notice';
import ContractResolver from './resolvers/contract';
import WalletResolver from './resolvers/wallet';
import ProposalResolver from './resolvers/proposal';
import MSAResolver from './resolvers/msa';

// Server state schemas
import ServerStatusSchema from './server/schemas/status';
import ServerStateSchema from './server/schemas/state';
import ServerSettingsSchema from './server/schemas/settings';

// Server state resolvers
import ServerStatusResolver from './server/resolvers/status';
import ServerStateResolver from './server/resolvers/state';
import ServerSettingsResolver from './server/resolvers/settings';

export const resolvers = [
  OrganizationResolver,
  ServerStatusResolver,
  ServerStateResolver,
  ServerSettingsResolver,
  RFPResolver,
  NoticeResolver,
  ContractResolver,
  WalletResolver,
  ProposalResolver,
  MSAResolver,
];

export const schemas = [
  OrganizationSchema,
  ServerStatusSchema,
  ServerStateSchema,
  ServerSettingsSchema,
  RFPSchema,
  NoticeSchema,
  ContractSchema,
  WalletSchema,
  ProposalSchema,
  MSASchema,
];

// TODO: Call this once in the /src/index.js
export const applyGraphQLMiddleware = app => {
  const httpServer = createServer(app);
  const GRAPHQL_PORT = process.env.GRAPHQL_PORT || 8001;
  const server = new ApolloServer({
    typeDefs: [coreQuery, ScalarsSchema, ...schemas],
    resolvers: [ScalarsResolver, ...resolvers],
    context: async () => {
      getAuthorization();
    },
  });
  server.applyMiddleware({ app, path: '/graphql' });
  server.installSubscriptionHandlers(httpServer);
  httpServer.listen({ port: GRAPHQL_PORT }, () => {
    logger.info(`Server ready at http://localhost:${GRAPHQL_PORT}${server.graphqlPath}.`, { service: 'API' });
    logger.info(`Subscriptions ready at ws://localhost:${GRAPHQL_PORT}${server.subscriptionsPath}.`, { service: 'API' });
  });
};

export default {
  resolvers,
  schemas,
  applyGraphQLMiddleware,
};
