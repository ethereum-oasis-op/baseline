
module.exports = {
  mongo: {
    bufferMaxEntries: process.env.MONGO_BUFFER_MAX_ENTRIES || 8,
    firstConnectRetryDelaySecs:
      process.env.MONGO_FIRST_CONNECT_RETRY_DELAY_SECS || 5,
  },
  nodes: {
    node_1: {
      ipAddress: 'geth-node',
      whisperPort: '8546',
      apiPort: '4001',
      origin: 'mychat2',
      dbUrl: 'mongodb://mongo:27017/radish34',
    },
  },
};
