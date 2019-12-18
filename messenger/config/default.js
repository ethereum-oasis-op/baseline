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
    useFindAndModify: false
  },
  messaging_type: "whisper"
};
