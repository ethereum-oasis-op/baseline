const express = require('express');
var morgan = require('morgan')
 
var app = express()
 
app.use(morgan('dev'))

const bodyParser = require('body-parser');
const apiRouter = require('./api/rest-express');

app.use(bodyParser.json({ limit: '2mb' }));
app.use('/api/v1', apiRouter.router);

module.exports = {
  app,
  apiRouter
};