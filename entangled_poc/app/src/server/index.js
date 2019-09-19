const express = require('express');
const cors = require('cors');
const graphqlHTTP = require('express-graphql');
const gql = require('graphql-tag');
const { buildASTSchema } = require('graphql');
const RFQS = [{ itemQty: 10 }];

const schema = buildASTSchema(gql`
  type Query {
    rfqs: [RfqObject]
    rfq(id: ID!): RfqObject
  }

  type RfqObject {
    id: ID
    itemQty: Int
  }
`);

const mapRfq = (rfq, id) => rfq && { id, ...rfq };

const root = {
  rfqs: () => RFQS.map(mapRfq),
  rfq: ({ id }) => mapRfq(RFQS[id], id)
};

const app = express();
app.use(cors());
app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true
  })
);

const port = process.env.PORT || 4000;
app.listen(port);
console.log(`Running a GraphQL API server at localhost:${port}/graphql`);
