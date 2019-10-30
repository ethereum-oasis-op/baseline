'use strict';

const express = require('express');
const app = express();
const fs = require('fs');
const db = require('./src/db');
const bodyParser = require('body-parser');

const nodeNum = process.argv[2];

const apiRouter = require('./router/api-router.js');

app.use(bodyParser.json({ limit: '2mb' }));
app.use('/api/v1', apiRouter.router);

// Get whisper websocket info from config file
async function getConfig() {
  let rawContents = await fs.readFileSync('../whisper/config/nodes.json');
  let contents = JSON.parse(rawContents);

  whisper_port = contents[`node_${nodeNum}`].whisper_port;
  geth_ip_address = contents[`node_${nodeNum}`].ip_address;
  whisper_origin = contents[`node_${nodeNum}`].origin;
  api_port = contents[`node_${nodeNum}`].api_port;
  if (!whisper_port || !whisper_origin) {
    console.error('Whisper parameter is undefined. Check config/nodes.json file and command line args.');
    process.exit();
  }
}

async function startApiRouter() {
  await getConfig();
  await apiRouter.initialize(geth_ip_address, whisper_port);
  server = app.listen(api_port, () => console.log('Express server listening on port ' + api_port));
  return server;
}

async function terminate() {
  await server.close();
  await db.close();
}

let server, whisper_port, whisper_origin, geth_ip_address, api_port;
let dbPromise = db.connect();
let apiPromise = dbPromise.then(startApiRouter);

module.exports = {
  serverPromise: apiPromise,
  terminate: terminate,
  app: app
};