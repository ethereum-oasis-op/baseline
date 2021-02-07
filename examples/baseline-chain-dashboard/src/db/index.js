import mongoose from "mongoose";
import { logger } from "../logger";

const config = {
  mongo: {
    debug: 'true',
    bufferMaxEntries: 8,
    firstConnectRetryDelaySecs: 5,
  },
  mongoose: {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    poolSize: 5, // Max. number of simultaneous connections to maintain
    socketTimeoutMS: 0, // Use os-default, only useful when a network issue occurs and the peer becomes unavailable
    keepAlive: true, // KEEP ALIVE!
  }
};

const { firstConnectRetryDelaySecs } = config.mongo;

// Setup DB
const conn = mongoose.connection;
let mongoUrl;

// Registering db connection event listeners
conn.once('open', () => {
  logger.info('Successfully connected to mongo db.');

  // When successfully connected
  conn.on('connected', () => {
    logger.debug(`Mongoose default connection open ${mongoUrl}.`);
  });

  // If the connection throws an error
  conn.on('error', (err) => {
    logger.error('Db connection error: %o', err);
  });

  // When the connection is disconnected
  conn.on('disconnected', () => {
    logger.info('Mongoose default connection disconnected.');
  });

  // If the Node process ends, close the Mongoose connection
  process.on('SIGINT', () => {
    conn.close(() => {
      logger.debug('Mongoose default connection disconnected through app termination.');
      process.exit(0);
    });
  });
});

function simpleSleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function dbConnect(url) {
  mongoUrl = url;
  if (config.mongo.debug === true) {
    mongoose.set('debug', function (collection, method, query, doc, options) {
      logger.debug(`Mongoose ${method} on ${collection} with query:\n%o`, query, {
        doc,
        options
      });
    });
  }

  let connected = false;
  while (!connected) {
    try {
      // eslint-disable-next-line no-await-in-loop
      await mongoose.connect(mongoUrl, config.mongoose);
      connected = true;
    } catch (err) {
      logger.error('\n%o', err);
      logger.info(`Retrying mongodb connection in ${firstConnectRetryDelaySecs}s.`);
    }

    // eslint-disable-next-line no-await-in-loop
    await simpleSleep(firstConnectRetryDelaySecs * 1000);
  }
}

export function dbClose() {
  logger.info('Closing db connection.');
  conn.close();
}
