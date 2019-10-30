const { ApolloServer, gql } = require('apollo-server');
const { PubSub } = require('graphql-subscriptions');

const pubsub = new PubSub();

// Custom config for each user type
const config = require('./../config.js');

const mongoose = require('mongoose');
const MongoSchema = mongoose.Schema;

const mongoConn = mongoose.createConnection('mongodb://127.0.0.1/radish34', {
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const RfqSchema = new MongoSchema({
  refNum: Number,
  itemQty: Number
});

// RfqSchema.post('update', (doc, next ) => {
//   const updateMessage = { update: doc.getUpdate() };
//   whisperObj = {
//     _id: new mongoose.mongo.ObjectId(),
//     deliverTo: 'Abc123',
//     sentAt: new Date().toISOString(),
//     receivedAt: null,
//     message: JSON.stringify(updateMessage)
//   };
//   WhisperModel.create(whisperObj);
//   console.log('Sent event', whisperObj);
//   pubsub.publish(NEW_WHISPER_EVENT, { whisperAdded: whisperObj });
//   next();
// });

const WhisperSchema = new MongoSchema({
  deliverTo: String,
  sentAt: String,
  receivedAt: String,
  message: String
});

const RfqModel = mongoConn.model('Rfq', RfqSchema);
const WhisperModel = mongoConn.model('Whisper', WhisperSchema);

const NEW_WHISPER_EVENT = 'whisperAdded';

const typeDefs = gql`
  type Query {
    rfqs: [RfqObject]
    findRfqByRef(refNum: Int!): RfqObject
    whispers: [WhisperObject]
  }

  type RfqObject {
    _id: ID
    refNum: Int
    itemQty: Int
  }

  type WhisperObject {
    _id: ID
    deliverTo: String
    sentAt: String
    receivedAt: String
    message: String
  }

  type Subscription {
    whisperAdded: WhisperObject
  }

  input RfqInput {
    itemQty: Int
  }

  type Mutation {
    updateRfq(_id: ID, input: RfqInput): RfqObject
  }
`;

const resolvers = {
  Query: {
    rfqs: () => RfqModel.find({}),
    findRfqByRef: ({ refNum }) => RfqModel.findOne({ refNum: refNum }),
    whispers: () => WhisperModel.find({})
  },
  Mutation: {
    updateRfq: async (root, args, context, info) => {
      console.log(args.input);
      const { _id, input } = args;
      const query = { _id: _id };
      RfqModel.updateOne(
        query,
        { $set: { itemQty: input.itemQty } },
        { new: true }
      )
        .then(docs => {
          if (docs) {
            console.log({ success: true, data: docs });
          } else {
            console.log({ success: false, data: 'no such document exists' });
          }
          const updateMessage = { itemQty: input.itemQty };
          whisperObj = {
            _id: new mongoose.mongo.ObjectId(),
            deliverTo: 'Abc123',
            sentAt: new Date().toISOString(),
            receivedAt: null,
            message: JSON.stringify(updateMessage)
          };
          WhisperModel.create(whisperObj);
          console.log('Sent event', whisperObj);
          pubsub.publish(NEW_WHISPER_EVENT, { whisperAdded: whisperObj });
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  Subscription: {
    whisperAdded: {
      subscribe: () => pubsub.asyncIterator(NEW_WHISPER_EVENT)
    }
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
