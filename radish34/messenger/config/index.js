// Set default values
let mongoDebug = 'true';

// Less verbose logs for 'production' (less chance to leak sensitive info)
if (process.env.LOG_LEVEL == 'prod') {
  mongoDebug = 'false';
};

module.exports = {
  mongo: {
    debug: mongoDebug,
    bufferMaxEntries: 8,
    firstConnectRetryDelaySecs: 5,
  },
  mongoose: {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    poolSize: 5, // Max. number of simultaneous connections to maintain
    socketTimeoutMS: 0, // Use os-default, only useful when a network issue occurs and the peer becomes unavailable
    keepAlive: true, // KEEP ALIVE!
  },
  logLevel: process.env.LOG_LEVEL || 'debug',
  messagingType: process.env.MESSENGER_PROVIDER || 'whisper',
  clientUrl: process.env.CLIENT_URL || 'ws://localhost:8548',
  dbUrl: process.env.DB_URL || 'mongodb://localhost:27117/radish34_test',
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  apiPort: process.env.MESSENGER_API_PORT || '4001',
  origin: 'mychat2',
  encryptionKey: process.env.ENCRYPT_KEY || 'testKey0123456789012345678901234' // Must be 256 bits (32 characters)
};
