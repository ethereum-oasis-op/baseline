const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const apiRouter = require('./api/rest-express');

const app = express();

app.use(morgan('dev'));
app.use(bodyParser.json({ limit: '2mb' }));
app.use('/api/v1', apiRouter.router);

module.exports = {
  app,
  apiRouter,
};
