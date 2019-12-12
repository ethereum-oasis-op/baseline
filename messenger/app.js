'use strict';

const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const apiRouter = require('./api/rest-express');

app.use(bodyParser.json({ limit: '2mb' }));
app.use('/api/v1', apiRouter.router);

module.exports = {
  app,
  apiRouter
};