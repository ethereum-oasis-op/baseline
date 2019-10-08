import { MongoClient } from 'mongodb';
import config from './config';

let db = null;
let client = null;

const wait = timeout => new Promise(resolve => setTimeout(resolve, timeout));

export default {
  connect: async () => {
    if (db) {
      return db;
    }

    for (let i = 0; i < config.MONGO_CONNECTION_RETRIES; i += 1) {
      try {
        client = await MongoClient.connect(config.MONGO_URL);
        console.log('connected to db');
        break;
      } catch (error) {
        await wait(500);
      }
    }

    if (!client) {
      throw new Error('Could not establish Mongo connection');
    }

    db = client.db(config.MONGO_DB_NAME);
    return db;
  },

  collection: collectionName => {
    return db.collection(collectionName);
  },

  get: () => {
    return db;
  },
};
