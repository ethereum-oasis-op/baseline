const express = require('express');
const bodyParser = require('body-parser');
const { UI } = require('bull-board');
const { logger, reqLogger, reqErrorLogger } = require('radish34-logger');
const apiRouter = require('./api/routes');
const { getMessenger } = require('./api/service');


async function startServer(apiPort) {
  logger.info('Starting express ...', { service: 'MESSENGER' });
  const app = express();

  app.use(reqLogger('MESSENGER'));
  app.use(bodyParser.json({ limit: '2mb' }));
  app.use('/api/v1', apiRouter.router);
  app.use('/bulls', UI);
  app.use(reqErrorLogger('MESSENGER'));

  app.listen(apiPort, () => logger.info(`REST based messenger microservice server listening on port ${apiPort}.`, { service: 'MESSENGER' }));

  await getMessenger();
}

module.exports = {
  startServer,
};
