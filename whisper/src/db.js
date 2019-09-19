'use strict';

const Config = require('../config');

const firstConnectRetryDelaySecs = Config.mongo.firstConnectRetryDelaySecs;

// Setup DB
const mongoose = require('mongoose');
const conn = mongoose.connection;

// Connection options
const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  reconnectTries: Number.MAX_VALUE, // Keep trying to reconnect
  reconnectInterval: 1000, // Per 1 sec
  poolSize: 5, // Number of simultaneous connections to maintain
  bufferMaxEntries: Config.mongo.bufferMaxEntries, // Configurable and set to 8 by default, delays notification if connection drops for any reason
  socketTimeoutMS: 0, // Use os-default, only useful when a network issue occurs and the peer becomes unavailable
  keepAlive: true // KEEP ALIVE!
};

conn.once('open', () => {
  console.log('Successfully connnected to ' + Config.mongo.uri);

  // When successfully connected
  conn.on('connected', () => {
    console.log('Mongoose default connection open to ' + Config.mongo.uri);
  });

  // If the connection throws an error
  conn.on('error', err => {
    console.error('Mongoose default connection error: ' + err);
  });

  // When the connection is disconnected
  conn.on('disconnected', () => {
    console.error('Mongoose default connection disconnected');
  });

  // If the Node process ends, close the Mongoose connection
  process.on('SIGINT', () => {
    conn.close(() => {
      console.log('Mongoose default connection disconnected through app termination');
      process.exit(0);
    });
  });
});

async function connect() {
  mongoose.set('debug', Boolean(Config.mongo.debug));

  let connected = false;
  while (!connected) {
    try {
      await mongoose.connect(Config.mongo.uri, options);
      connected = true;
    } catch (error) {
      console.error(error.message);
      console.log('Retrying connection in ' + firstConnectRetryDelaySecs + ' secs');
    }

    await sleep(firstConnectRetryDelaySecs * 1000);
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function close() {
  console.log('Closing DB connection');
  conn.close();
}

module.exports = {
  close: close,
  connect: connect
};
