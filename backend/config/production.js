'use strict';

module.exports = {
  mongo: {
    bufferMaxEntries: process.env.MONGO_BUFFER_MAX_ENTRIES || 8,
    firstConnectRetryDelaySecs: process.env.MONGO_FIRST_CONNECT_RETRY_DELAY_SECS || 5
  },
  nodes: {
    node_1: {
      ip_address: "127.0.0.1",
      whisper_port: "8546",
      api_port: "4001",
      origin: "mychat2",
      db_url: "mongodb://127.0.0.1:27018/radish34"
    }
  }
};