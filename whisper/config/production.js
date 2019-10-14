'use strict';

module.exports = {
  server: {
    listener: {
      port: process.env.LEDGER_API_SERVER_PORT,
      internalPort: process.env.INTERNAL_PORT
    },
    queries: {
      limit: process.env.LEDGER_API_QUERY_LIMIT
    }
  },
  mongo: {
    uri: process.env.LEDGER_MONGO_URI,
    bufferMaxEntries: process.env.LEDGER_MONGO_BUFFER_MAX_ENTRIES || 8,
    firstConnectRetryDelaySecs: process.env.LEDGER_MONGO_FIRST_CONNECT_RETRY_DELAY_SECS || 5
  }
};