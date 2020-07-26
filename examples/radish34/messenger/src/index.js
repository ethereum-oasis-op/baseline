const { startServer } = require('./server');
const { connect: dbConnect } = require('./db/connect');
const Config = require('../config');
const { logger } = require('radish34-logger');

// Import bull queues so they create redis connections
require('./queues/sendMessage');
require('./queues/receiveMessage');

const main = async () => {
  try {
    await dbConnect(Config.dbUrl);
    await startServer(Config.apiPort);
  } catch (err) {
    logger.error('Initialization error.\n%o', err, { service: 'MESSENGER' });
  }
};

main();
