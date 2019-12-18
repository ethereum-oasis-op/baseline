const { app, apiRouter } = require('./app.js');
const db = require('./src/db');
const Config = require('./config');

let server; let whisperPort; let whisperOrigin; let gethIpAddress; let
  apiPort;

const nodeNum = process.env.NODE_NUM || 1;

function getConfig() {
  dbUrl = Config.nodes[`node_${nodeNum}`].dbUrl;
  whisperPort = Config.nodes[`node_${nodeNum}`].whisperPort;
  gethIpAddress = Config.nodes[`node_${nodeNum}`].ipAddress;
  whisperOrigin = Config.nodes[`node_${nodeNum}`].origin;
  apiPort = Config.nodes[`node_${nodeNum}`].apiPort;
  if (!whisperPort || !whisperOrigin) {
    console.error('Whisper parameter is undefined. Check config/nodes.json file and command line args.');
    process.exit();
  }
}

async function startApiRouter() {
  await getConfig();
  await apiRouter.initialize();
  server = app.listen(apiPort, () => console.log(`Express server listening on port ${apiPort}`));
  return server;
}

async function terminate() {
  await server.close();
  await db.close();
}

let { dbUrl } = Config.nodes[`node_${nodeNum}`];
const dbPromise = db.connect(dbUrl);
const serverPromise = dbPromise.then(startApiRouter);

module.exports = {
  serverPromise,
  terminate,
};
