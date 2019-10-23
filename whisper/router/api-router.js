'use strict';

const express = require('express');
const router = express.Router();
const WhisperWrapper = require('../src/WhisperWrapper');
const ContactUtils = require('../src/ContactUtils');
const EntangleUtils = require('../src/EntanglementUtils');
const RFQUtils = require('../src/RFQUtils');
const Config = require('../config');
const { getDB } = require('../src/db');

let messenger, contactUtils, entangleUtils, rfqUtils;

router.get('/health-check', async (req, res) => {
  res.status(200);
  res.send({ message: 'Everything is good! Thanks for checking.' });
});

router.get('/identities', async (req, res) => {
  let result = await messenger.getIdentities();
  res.status(200);
  res.send(result);
});

router.post('/identities', async (req, res) => {
  let result = await messenger.createIdentity();
  // TODO: do we need to add this identity to the Registry smart contract?
  res.status(201);
  res.send(result);
});

router.get('/contacts', async (req, res) => {
  let result = await contactUtils.getAllContacts();
  res.status(200);
  res.send(result);
});

router.post('/contacts', async (req, res) => {
  let result = await contactUtils.createContact(req.body);
  res.status(201);
  res.send(result);
});

// Fetch messages from private 1:1 conversation
router.get('/messages/:myId/topics/:topicId/contacts/:contactId', async (req, res) => {
  let result = await messenger.getMessages(req.params.myId, req.params.topicId, req.params.contactId);
  res.status(200);
  res.send(result);
});

router.post('/messages/:senderId', async (req, res) => {
  let result;
  // private is a required field to ensure private messages aren't accidentally sent publicly
  if (typeof req.body.private == 'undefined' || !req.body.message) {
    res.status(400);
    res.send({ error: 'Request body must contain following fields: private, message' });
    return;
  }
  if (req.body.private) {
    result = await messenger.sendPrivateMessage(req.params.senderId, req.body.recipientId, req.body.topic, req.body.message);
  } else {
    result = await messenger.sendPublicMessage(req.params.senderId, req.body.topic, req.body.message);
  }
  res.status(200);
  res.send(result);
});

// Create a new RFQ
router.post('/rfqs', async (req, res) => {
  let doc = req.body;
  if (!doc.sku || !doc.quantity || !doc.deliveryDate) {
    res.status(400);
    res.send({ error: 'Following fields must be provided in request body: sku, quantity, deliveryDate' });
    return;
  }
  let result = await rfqUtils.createRFQ(doc);
  res.status(201);
  res.send(result);
});

// Get all RFQs
router.get('/rfqs', async (req, res) => {
  let result = await rfqUtils.getAllRFQs();
  res.status(200);
  res.send(result);
});

// Get a specific RFQ
router.get('/rfqs/:rfqId', async (req, res) => {
  let result = await rfqUtils.getSingleRFQ(req.params.rfqId);
  res.status(200);
  res.send(result);
});

// ***** Generate a new Entanglement *****
//  req.body:
//    dataField: {  (required)
//      value: String,
//      dataId: String,
//      description: String
//    },
//    whisperId: 0x... (required)
//    partnerIds: []
router.post('/entanglements', async (req, res) => {
  let doc = req.body;
  if (!doc.databaseLocation.collection || !doc.databaseLocation.objectId) {
    res.status(400);
    res.send({ error: 'Following fields must be provided in request body: databaseLocation.collection, databaseLocation.objectId' });
    return;
  }
  // Will generate random topic and password to use for this entanglement,
  // and share it with other participants via private Whisper messages
  let result = await messenger.createEntanglement(doc);
  res.status(201);
  res.send(result);
});

// List all Entanglements (or Entanglements for a given user)
router.get('/entanglements', async (req, res) => {
  let userId = req.query.userId;
  let result = await entangleUtils.getEntanglements(userId);
  res.status(200);
  res.send(result);
});

// Get a specific Entanglement
router.get('/entanglements/:entanglementId', async (req, res) => {
  let result = await entangleUtils.getSingleEntanglement(req.params.entanglementId);
  res.status(200);
  res.send(result);
});

// Get an Entanglement's dataHash
router.get('/entanglements/:entanglementId/hash', async (req, res) => {
  let result = await entangleUtils.calculateHash(req.params.entanglementId);
  res.status(200);
  res.send({ hash: result });
});

// ***** Update an Entanglement *****
//  req.body:
//    dataField: {
//      value: String,
//      description: String
//    },
//    contactId: 0x... (required)
//    acceptedRequest: Boolean (optional)
router.put('/entanglements/:entanglementId', async (req, res) => {
  let result;
  if (req.body.acceptedRequest === true) {
    // Set acceptedRequest for my whisperId to 'true'
    result = await messenger.acceptEntanglement(req.params.entanglementId, req.body);
  } else {
    result = await messenger.updateEntanglement(req.params.entanglementId, req.body);
  }
  res.status(200);
  res.send(result);
});

async function initialize(ipAddress, port) {
  // Retrieve the db connection and pass to helper classes
  let db = await getDB();
  if (Config.messaging_type === "whisper") {
    messenger = await new WhisperWrapper(db, ipAddress, port);
  }
  let connected = await messenger.isConnected();
  await messenger.loadIdentities();

  entangleUtils = new EntangleUtils(db, messenger);
  rfqUtils = new RFQUtils(db);
  contactUtils = new ContactUtils(db);
  return connected;
}

module.exports = {
  router: router,
  initialize: initialize
};
