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
      db_url: "mongodb://127.0.0.1:27018/radish34_dev_1"
    },
    node_2: {
      ip_address: "127.0.0.1",
      whisper_port: "8548",
      api_port: "4002",
      origin: "mychat2",
      db_url: "mongodb://127.0.0.1:27018/radish34_dev_2"
    },
    node_3: {
      ip_address: "127.0.0.1",
      whisper_port: "8550",
      api_port: "4003",
      origin: "mychat2",
      db_url: "mongodb://127.0.0.1:27018/radish34_dev_3"
    }
  }
};