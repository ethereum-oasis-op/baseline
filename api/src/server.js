import express from 'express';
import { UI } from 'bull-board';
import bodyParser from 'body-parser';
import { applyGraphQLMiddleware } from './graphql';
import messageRoutes from './routes/messenger';
import healthRoutes from './routes/healthCheck';

export default async function startServer() {
  console.log('Starting Express ...');
  const app = express();

  app.use(bodyParser.json({ limit: '2mb' }));
  app.use('/api/v1', messageRoutes);
  app.use('/api/v1', healthRoutes);
  app.use('/bulls', UI);

  applyGraphQLMiddleware(app);

  const REST_PORT = process.env.REST_PORT || 8101;

  app.listen(REST_PORT, () =>
    console.log(`🚀 Internal REST-Express server listening at http://localhost:${REST_PORT}`),
  );
}
