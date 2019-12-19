
module.exports = {
  mongo: {
    debug: true,
    bufferMaxEntries: 8,
    firstConnectRetryDelaySecs: 5,
  },
  nodes: {
    node_1: {
      ipAddress: '127.0.0.1',
      whisperPort: '8546',
      apiPort: '4001',
      origin: 'mychat2',
      dbUrl: 'mongodb://127.0.0.1:27018/radish34_dev_1',
    },
    node_2: {
      ipAddress: '127.0.0.1',
      whisperPort: '8548',
      apiPort: '4002',
      origin: 'mychat2',
      dbUrl: 'mongodb://127.0.0.1:27018/radish34_dev_2',
    },
    node_3: {
      ipAddress: '127.0.0.1',
      whisperPort: '8550',
      apiPort: '4003',
      origin: 'mychat2',
      dbUrl: 'mongodb://127.0.0.1:27018/radish34_dev_3',
    },
  },
};
