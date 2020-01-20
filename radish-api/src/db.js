import { MongoClient } from 'mongodb';
import mongoose from 'mongoose';

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
        console.log('Connected to db');
        break;
      } catch (error) {
        await wait(500);
      }
    }

    if (!client) {
      throw new Error('Could not establish Mongo connection');
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
        //await mongoose.set('debug', true);
        await mongoose.connect(dbFullName, options);
        console.log('Mongoose connected to db');
        break;
      } catch (error) {
        const delayTime = 500;
        console.error(error.message);
        console.log(`Retrying Mongoose connection in ${delayTime} ms`);
        await wait(delayTime);
      }
    }
  },
};
