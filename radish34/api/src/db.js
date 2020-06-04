import { MongoClient } from 'mongodb';
import mongoose from 'mongoose';
import { logger } from 'radish34-logger';

let db = null;
let client = null;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
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
        logger.info('Conntected to mongo db.', { service: 'API' });
        break;
      } catch (err) {
        logger.error('\n%o', err, { service: 'API' });
        await wait(500);
      }
    }

    if (!client) {
      logger.error('Could not establish Mongo connection', { service: 'API' });
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

  // TODO: Make this more generic
  connectMongoose: async () => {
    const dbFullName = `${process.env.MONGO_URL}/${process.env.MONGO_DB_NAME}`;
    for (let i = 0; i < (process.env.MONGO_CONNECTION_RETRIES || 5); i += 1) {
      try {
        await mongoose.connect(dbFullName, options);
        logger.info('Mongoose connected to db.', { service: 'API' });
        break;
      } catch (err) {
        const delayTime = 500;
        logger.error('\n%o', err, { service: 'API' });
        logger.info(`Retrying Mongoose connection in ${delayTime}ms.`, { service: 'API' });
        await wait(delayTime);
      }
    }
  },
};
