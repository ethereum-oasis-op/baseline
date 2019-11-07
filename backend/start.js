const { app, apiRouter } = require('./app.js');
const db = require('./src/db');
const Config = require('./config');

let server, whisper_port, whisper_origin, geth_ip_address, api_port;

const nodeNum = process.argv[2];

function getConfig() {
  db_url = Config.nodes[`node_${nodeNum}`].db_url;
  whisper_port = Config.nodes[`node_${nodeNum}`].whisper_port;
  geth_ip_address = Config.nodes[`node_${nodeNum}`].ip_address;
  whisper_origin = Config.nodes[`node_${nodeNum}`].origin;
  api_port = Config.nodes[`node_${nodeNum}`].api_port;
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

let db_url = Config.nodes[`node_${nodeNum}`].db_url;
let dbPromise = db.connect(db_url);
let serverPromise = dbPromise.then(startApiRouter);

module.exports = {
  serverPromise,
  terminate
};