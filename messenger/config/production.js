'use strict';

module.exports = {
  mongo: {
    bufferMaxEntries: process.env.MONGO_BUFFER_MAX_ENTRIES || 8,
    firstConnectRetryDelaySecs: process.env.MONGO_FIRST_CONNECT_RETRY_DELAY_SECS || 5
  },
  nodes: {
    node_1: {
      ip_address: "geth-node",
      whisper_port: "8546",
      api_port: "4001",
      origin: "mychat2",
      db_url: "mongodb://mongo:27017/radish34"
    }
  }
};