'use strict';

const express = require('express');
const router = express.Router();
const Config = require('../config');
const WhisperWrapper = require('../src/WhisperWrapper');
const ContactUtils = require('../src/ContactUtils');
const EntangleUtils = require('../src/entanglementUtils');
const rfqUtils = customRequire('src/RFQUtils');

let messenger, contactUtils, entangleUtils;

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
  if (!doc.sku || !doc.quantity || !doc.deliveryDate || !doc.supplierId) {
    res.status(400);
    res.send({ error: 'Following fields must be provided in request body: sku, quantity, deliveryDate, supplierId' });
    return;
  }
  let result = await rfqUtils.createRFQ(doc);
  result._doc.type = 'rfq_create';
  console.log('result:', result);
  await messenger.sendPrivateMessage(result.buyerId, result.supplierId, undefined, JSON.stringify(result));
  res.status(201);
  res.send(result);
});

router.put('/rfqs/:rfqId', async (req, res) => {
  let result = await rfqUtils.updateRFQ(req.params.rfqId, req.body);
  res.status(200);
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
  let result;
  try {
    result = await entangleUtils.createEntanglement(doc);
  } catch (err) {
    console.log('error: ', err);
    res.status(404);
    res.send({ error: err.message });
  }
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
  let result = await entangleUtils.getSingleEntanglement({ _id: req.params.entanglementId });
  res.status(200);
  res.send(result);
});

// Get an Entanglement's dataHash
router.get('/entanglements/:entanglementId/hash', async (req, res) => {
  let entanglement = await entangleUtils.getSingleEntanglement({ _id: req.params.entanglementId });
  let result = await entangleUtils.calculateHash(entanglement.databaseLocation.collection, entanglement.databaseLocation.objectId);
  res.status(200);
  res.send({ recalculated_hash: result });
});

// ***** Update an Entanglement *****
//  req.body:
//    databaseLocation: {
//      collection: String,
//      objectId: String
//    },
//    messengerId: 0x...
//    acceptedRequest: Boolean (optional)
router.put('/entanglements/:entanglementId', async (req, res) => {
  let result;
  if (req.body.acceptedRequest === true) {
    // Set acceptedRequest for my whisperId to 'true'
    result = await entangleUtils.acceptEntanglement(req.params.entanglementId, req.body);
  } else {
    result = await entangleUtils.updateEntanglement(req.params.entanglementId, req.body);
  }
  res.status(200);
  res.send(result);
});

async function initialize(ipAddress, port) {
  // Retrieve messenger instance and pass to helper classes
  // Modularized here to enable use of other messenger services in the future
  if (Config.messaging_type === "whisper") {
    messenger = await new WhisperWrapper(ipAddress, port);
  }
  let connected = await messenger.isConnected();
  await messenger.loadIdentities();

  contactUtils = new ContactUtils();
  entangleUtils = await new EntangleUtils(messenger);
  await messenger.addEntangleUtils(entangleUtils);

  // Pass the EntangleUtils instance to each business object that is allowed to be entangled
  await rfqUtils.addEntangleUtils(entangleUtils);
  await rfqUtils.addListener();
  return connected;
}

module.exports = {
  router: router,
  initialize: initialize
};
