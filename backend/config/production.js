'use strict';

module.exports = {
  server: {
    listener: {
      port: process.env.SERVER_PORT,
      internalPort: process.env.INTERNAL_PORT
    },
    queries: {
      limit: process.env.LEDGER_API_QUERY_LIMIT
    }
  },
  mongo: {
    uri: process.env.MONGODB_URL || "mongodb://127.0.0.1:27017/radish34",
    bufferMaxEntries: process.env.MONGO_BUFFER_MAX_ENTRIES || 8,
    firstConnectRetryDelaySecs: process.env.MONGO_FIRST_CONNECT_RETRY_DELAY_SECS || 5
  }
};