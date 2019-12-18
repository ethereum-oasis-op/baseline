'use strict';

module.exports = {
  mongo: {
    debug: true,
    bufferMaxEntries: 8,
    firstConnectRetryDelaySecs: 5
  },
  nodes: {
    node_1: {
      ip_address: "127.0.0.1",
      whisper_port: "8546",
      api_port: "4001",
      origin: "mychat2",
      db_url: "mongodb://127.0.0.1:27017/radish34"
    }
  }
};
