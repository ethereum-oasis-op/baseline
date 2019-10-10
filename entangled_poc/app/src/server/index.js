const express = require('express');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cors = require('cors');
const graphqlHTTP = require('express-graphql');
const gql = require('graphql-tag');
const { buildASTSchema } = require('graphql');

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
  type Query {
    rfqs: [RfqObject]
    findRfqByRef(refNum: Int!): RfqObject
  }

  type RfqObject {
    _id: ID
    refNum: Int
    itemQty: Int
  }

  input RfqInput {
    itemQty: Int
  }

  type Mutation {
    updateRfq(_id: ID, input: RfqInput): RfqObject
  }
`);

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
  }
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
