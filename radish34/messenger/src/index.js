const { startServer } = require('./server');
const { connect: dbConnect } = require('./db/connect');
const Config = require('../config');
const { logger } = require('radish34-logger');

// Import bull queues so they create redis connections
require('./queues/sendMessage');
require('./queues/receiveMessage');

const userIndex = process.env.USER_INDEX || 0;
const { dbUrl, apiPort } = Config.users[userIndex];

const main = async () => {
  try {
    await dbConnect(dbUrl);
    await startServer(apiPort);
  } catch (err) {
    logger.error('Initialization error.\n%o', err, { service: 'MESSENGER' });
  }
};

main();
