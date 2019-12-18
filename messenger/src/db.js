const mongoose = require('mongoose');

const Config = require('../config');

const { firstConnectRetryDelaySecs } = Config.mongo;

// Setup DB
const conn = mongoose.connection;
let mongoUrl;

// Registering db connection event listeners
conn.once('open', () => {
  console.log(`Successfully connected to ${mongoUrl}`);

  // When successfully connected
  conn.on('connected', () => {
    console.log(`Mongoose default connection open to ${mongoUrl}`);
  });

  // If the connection throws an error
  conn.on('error', (err) => {
    console.error(`Mongoose default connection error: ${err}`);
  });

  // When the connection is disconnected
  conn.on('disconnected', () => {
    console.error('Mongoose default connection disconnected');
  });

  // If the Node process ends, close the Mongoose connection
  process.on('SIGINT', () => {
    conn.close(() => {
      console.log(
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
  mongoose.set('debug', Config.mongo.debug);

  let connected = false;
  while (!connected) {
    try {
      // eslint-disable-next-line no-await-in-loop
      console.log('mongoURL', mongoUrl);
      await mongoose.connect(mongoUrl, Config.mongoose);
      connected = true;
    } catch (error) {
      console.error(error.message);
      console.log(`Retrying connection in ${firstConnectRetryDelaySecs} secs`);
    }

    // eslint-disable-next-line no-await-in-loop
    await simpleSleep(firstConnectRetryDelaySecs * 1000);
  }
}

function close() {
  console.log('Closing DB connection');
  conn.close();
}

module.exports = {
  close,
  connect,
};
