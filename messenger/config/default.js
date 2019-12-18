'use strict';

module.exports = {
  mongo: {
    debug: false,
    uri: process.env.MONGODB_URL || "mongodb://127.0.0.1:27017/radish34",
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
    keepAlive: true // KEEP ALIVE!
  },
  messaging_type: "whisper"
};
