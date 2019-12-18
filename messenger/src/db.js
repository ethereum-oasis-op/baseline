'use strict';

const Config = require('../config');

const firstConnectRetryDelaySecs = Config.mongo.firstConnectRetryDelaySecs;

// Setup DB
const mongoose = require('mongoose');
const conn = mongoose.connection;
let mongoURL;

// Registering db connection event listeners
conn.once('open', () => {
  console.log('Successfully connected to ' + mongoURL);

  // When successfully connected
  conn.on('connected', () => {
    console.log('Mongoose default connection open to ' + mongoURL);
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

async function connect(db_url) {
  mongoURL = db_url;
  mongoose.set('debug', Config.mongo.debug);

  let connected = false;
  while (!connected) {
    try {
      await mongoose.connect(mongoURL, Config.mongoose);
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
