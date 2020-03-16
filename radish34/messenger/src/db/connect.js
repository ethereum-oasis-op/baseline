const mongoose = require('mongoose');
const logger = require('winston');
const Config = require('../../config');

const { firstConnectRetryDelaySecs } = Config.mongo;

// Setup DB
const conn = mongoose.connection;
let mongoUrl;

// Registering db connection event listeners
conn.once('open', () => {
  logger.info(`SUCCESS: connected to mongo`);

  // When successfully connected
  conn.on('connected', () => {
    logger.debug(`Mongoose default connection open ${mongoUrl}`);
  });

  // If the connection throws an error
  conn.on('error', (err) => {
    logger.error(`Mongoose default connection error: ${err}`);
  });

  // When the connection is disconnected
  conn.on('disconnected', () => {
    logger.error('Mongoose default connection disconnected');
  });

  // If the Node process ends, close the Mongoose connection
  process.on('SIGINT', () => {
    conn.close(() => {
      logger.debug(
        'Mongoose default connection disconnected through app termination',
      );
      process.exit(0);
    });
  });
});

function simpleSleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function connect(url) {
  mongoUrl = url;
  if (Config.mongo.debug == true) {
    mongoose.set('debug', function (collection, method, query, doc, options) {
      logger.debug(`Mongoose ${method} on ${collection} query: ${JSON.stringify(query)}`, {
        doc,
        options
      });
    });
  }

  let connected = false;
  while (!connected) {
    try {
      // eslint-disable-next-line no-await-in-loop
      await mongoose.connect(mongoUrl, Config.mongoose);
      connected = true;
    } catch (error) {
      logger.error(error.message);
      logger.info(`Retrying connection in ${firstConnectRetryDelaySecs} secs`);
    }

    // eslint-disable-next-line no-await-in-loop
    await simpleSleep(firstConnectRetryDelaySecs * 1000);
  }
}

function close() {
  logger.info('Closing DB connection');
  conn.close();
}

module.exports = {
  close,
  connect,
};
