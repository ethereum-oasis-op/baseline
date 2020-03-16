
module.exports = {
  mongo: {
    debug: true,
    bufferMaxEntries: 8,
    firstConnectRetryDelaySecs: 5,
  },
  users: [
    {
      ipAddress: '127.0.0.1',
      messengerPort: '8546',
      apiPort: '4001',
      origin: 'mychat2',
      dbUrl: 'mongodb://mongo-buyer:27017/radish34_test',
    },
    {
      ipAddress: '127.0.0.1',
      messengerPort: '8548',
      apiPort: '4002',
      origin: 'mychat2',
      dbUrl: 'mongodb://mongo-supplier1:27017/radish34_test',
    },
    {
      ipAddress: '127.0.0.1',
      messengerPort: '8550',
      apiPort: '4003',
      origin: 'mychat2',
      dbUrl: 'mongodb://mongo-supplier2:27017/radish34_test',
    },
  ],
  encryptionKey: process.env.ENCRYPT_KEY, // Must be 256 bits (32 characters)
};
