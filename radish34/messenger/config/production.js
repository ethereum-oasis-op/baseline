
module.exports = {
  mongo: {
    bufferMaxEntries: process.env.MONGO_BUFFER_MAX_ENTRIES || 8,
    firstConnectRetryDelaySecs:
      process.env.MONGO_FIRST_CONNECT_RETRY_DELAY_SECS || 5,
  },
  users: [
    {
      ipAddress: 'geth-node',
      messengerPort: '8546',
      clientUrl: 'ws://geth-node:8548',
      apiPort: '4001',
      origin: 'mychat2',
      dbUrl: process.env.MONGO_URL || 'mongodb://mongo-radish:27017/radish34',
      redisUrl: process.env.REDIS_URL || 'redis://redis-radish:6379',
    },
  ],
  encryptionKey: process.env.ENCRYPT_KEY, // Must be 256 bits (32 characters)
};
