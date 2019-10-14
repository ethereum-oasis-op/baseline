const express = require('express');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cors = require('cors');
const graphqlHTTP = require('express-graphql');
const gql = require('graphql-tag');
const { buildASTSchema } = require('graphql');
const {
  GraphQLDate,
  GraphQLDateTime,
  GraphQLTime
} = require('graphql-iso-date');

// Custom config for each user type
const config = require('./../config.js');

const mongoConn = mongoose.createConnection('mongodb://127.0.0.1/radish34', {
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const RfqSchema = new Schema({
  refNum: Number,
  itemQty: Number
});

const RfqModel = mongoConn.model('Rfq', RfqSchema);

// GraphQL schema
const schema = buildASTSchema(gql`
  scalar Date
  scalar Time
  scalar DateTime

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

  input RfqInput {
    itemQty: Int
  }

  type Mutation {
    updateRfq(_id: ID, input: RfqInput): RfqObject
  }
`);

const DEMO_WHISPERS = [
  {
    _id: 123213,
    deliverTo: '0x0123',
    sentAt: '10/1/2010 12:02:30:30',
    receivedAt: '10/2/2010 01:03:43:12',
    message: 'Hello test 1 2 3'
  }
];

const rootResolver = {
  rfqs: () => RfqModel.find({}),
  findRfqByRef: ({ refNum }) => RfqModel.findOne({ refNum: refNum }),
  updateRfq: async ({ _id, input }) => {
    RfqModel.findByIdAndUpdate(
      _id,
      { $set: { itemQty: input.itemQty } },
      { new: true }
    )
      .then(docs => {
        if (docs) {
          console.log({ success: true, data: docs });
        } else {
          console.log({ success: false, data: 'no such document exists' });
        }
      })
      .catch(err => {
        console.log(err);
      });
  },
  whispers: DEMO_WHISPERS
};

const app = express();
app.use(cors());
app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    rootValue: rootResolver,
    graphiql: true
  })
);

const port = process.env.PORT || 4000;
app.listen(port);
console.log(`Running a GraphQL API server at localhost:${port}/graphql`);
