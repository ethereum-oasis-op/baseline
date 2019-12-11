'use strict';

const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const Identities = require('./src/models/Identity');
const WhisperWrapper = require('./src/WhisperWrapper');

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Query {
    hello: String
    identities: [Identity]
  }

  type Mutation {
    createIdentity: Identity
  }

  type Identity {
    _id: ID
    created: Int
    keyId: String
    privateKey: String
    publicKey: String
  }

  type RFQ {
    _id: ID
    sku: String
    quantity: String
    description: String
    deliveryDate: String
    buyerId: String
    supplierId: String
    lastUpdated: String
    created: String
  }

  type Message {
    _id: ID
    messageType: String
    recipientId: String
    senderId: String
    ttl: String
    topic: String
    payload: String
    pow: String
    ack_rcvd: Boolean
    timestamp: String
  }

  type Participant {
    messengerId: String
    isSelf: Boolean
    acceptedRequest: Boolean
    dataHash: String
    lastUpdated: String
  }

  type Blockchain {
    contractAddress: String
    setMethodId: String
    getMethodId: String
  }

  type DatabaseLocation {
      collection: String
      objectId: String
  }

  type Entanglement {
    _id: ID
    blockchain: Blockchain
    created: String
    databaseLocation: DatabaseLocation
    participants: [Participant]
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    hello: () => 'world!',
    identities: () => 'world!',
  },
  Mutation: {
    createIdentity: async () => {
      const wWrapper = new WhisperWrapper();
      return await wWrapper.createIdentity();
    }
  }
};

const server = new ApolloServer({ typeDefs, resolvers });
const app = express();

const bodyParser = require('body-parser');
const apiRouter = require('./api/rest-express');

app.use(bodyParser.json({ limit: '2mb' }));
app.use('/api/v1', apiRouter.router);

// Adding the REST endpoints as middleware to the GraphQL endpoints
server.applyMiddleware({ app });

module.exports = {
  app,
  apiRouter
};