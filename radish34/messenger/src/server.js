const express = require('express');
const bodyParser = require('body-parser');
const { UI } = require('bull-board');
const apiRouter = require('./api/rest-express');
const { logger, reqLogger, reqErrorLogger } = require('radish34-logger');

async function startServer(apiPort) {
  logger.info('Starting express ...', { service: 'MESSENGER' });
  const app = express();

  app.use(reqLogger('MESSENGER'));
  app.use(bodyParser.json({ limit: '2mb' }));
  app.use('/api/v1', apiRouter.router);
  app.use('/bulls', UI);
  app.use(reqErrorLogger('MESSENGER'));

  app.listen(apiPort, () => logger.info(`REST based messenger microservice server listening on port ${apiPort}.`, { service: 'MESSENGER' }));

  await apiRouter.initialize();
}

module.exports = {
  startServer,
};
