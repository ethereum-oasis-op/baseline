
module.exports = {
  mongo: {
    debug: true,
    bufferMaxEntries: 8,
    firstConnectRetryDelaySecs: 5,
  },
  nodes: {
    node_1: {
      ipAddress: '127.0.0.1',
      whisperPort: '8548',
      apiPort: '4001',
      origin: 'mychat2',
      dbUrl: 'mongodb://127.0.0.1:27017/radish34_test',
    },
  },
};
