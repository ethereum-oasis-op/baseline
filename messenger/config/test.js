
module.exports = {
  mongo: {
    debug: true,
    bufferMaxEntries: 8,
    firstConnectRetryDelaySecs: 5,
  },
  logging: {
    level: 'debug'
  },
  users: [
    {
      ipAddress: 'localhost',
      messengerPort: '8548',
      apiPort: '4001',
      origin: 'mychat2',
      dbUrl: 'mongodb://127.0.0.1:27017/radish34_test',
      redisUrl: 'redis://redis-buyer:6379',
    },
  ],
  encryptionKey: 'testKey0123456789012345678901234' // Must be 256 bits (32 characters)
};
