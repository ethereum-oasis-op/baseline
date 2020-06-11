
module.exports = {
  mongo: {
    debug: true,
    bufferMaxEntries: 8,
    firstConnectRetryDelaySecs: 5,
  },
  users: [
    {
      ipAddress: 'localhost',
      messengerPort: '8548',
      apiPort: '4001',
      origin: 'mychat2',
      dbUrl: 'mongodb://localhost:27017/radish34_test',
      redisUrl: 'redis://localhost:6379',
    },
  ],
  encryptionKey: 'testKey0123456789012345678901234' // Must be 256 bits (32 characters)
};
