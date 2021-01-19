import { MongoClient } from 'mongodb';
import { logger } from 'radish34-logger';

let db = null;
let client = null;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const wait = timeout => new Promise(resolve => setTimeout(resolve, timeout));

export default {
  connect: async () => {
    if (db) {
      return db;
    }

    for (let i = 0; i < (process.env.MONGO_CONNECTION_RETRIES || 5); i += 1) {
      try {
        client = await MongoClient.connect(process.env.MONGO_URL, options);
        logger.info('Connected to mongo db.', { service: 'ZKP' });
        break;
      } catch (error) {
        await wait(500);
      }
    }

    if (!client) {
      logger.error('Could not establish mongo db connection.', { service: 'ZKP' });
      throw new Error('Could not establish mongo db connection.');
    }

    db = client.db(process.env.MONGO_DB_NAME);
    return db;
  },

  collection: collectionName => {
    return db.collection(collectionName);
  },

  get: () => {
    return db;
  },
};
