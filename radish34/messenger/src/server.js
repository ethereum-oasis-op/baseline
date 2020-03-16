const express = require('express');
const bodyParser = require('body-parser');
const { UI } = require('bull-board');
const logger = require('winston');
const apiRouter = require('./api/rest-express');
const { RequestLogger, RequestErrorLogger } = require('./api/loggers-express');

async function startServer(apiPort) {
  logger.info('Starting Express ...');
  const app = express();

  app.use(RequestLogger());
  app.use(bodyParser.json({ limit: '2mb' }));
  app.use('/api/v1', apiRouter.router);
  app.use('/bulls', UI);
  app.use(RequestErrorLogger());

  app.listen(apiPort, () => logger.info(`🚀 REST-Express server listening on port ${apiPort}`));

  await apiRouter.initialize();
}

module.exports = {
  startServer,
};
