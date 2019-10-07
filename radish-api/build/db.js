"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongodb = require("mongodb");

var _config = _interopRequireDefault(require("./config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let db = null;
let client = null;

const wait = timeout => new Promise(resolve => setTimeout(resolve, timeout));

var _default = {
  connect: async () => {
    if (db) {
      return db;
    }

    for (let i = 0; i < _config.default.MONGO_CONNECTION_RETRIES; i++) {
      try {
        client = await _mongodb.MongoClient.connect(_config.default.MONGO_URL);
        console.log('connected to db');
        break;
      } catch (error) {
        await wait(500);
      }
    }

    if (!client) {
      throw new Error('Could not establish Mongo connection');
    }

    db = client.db(_config.default.MONGO_DB_NAME);
    return db;
  },
  collection: collectionName => {
    return db.collection(collectionName);
  },
  get: () => {
    return db;
  }
};
exports.default = _default;