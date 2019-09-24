'use strict';

const express = require('express');
const router = express.Router();
const WhisperWrapper = require('../src/WhisperWrapper');
const ContactUtils = require('../src/ContactUtils');
const entangleUtils = require('../src/entanglementUtils');

let whisperWrapper, contactUtils;

router.get('/health-check', async (req, res) => {
  res.status(200);
  res.send({ message: 'Everything is good! Thanks for checking.' });
});

router.get('/identities', async (req, res) => {
  let result = await whisperWrapper.getWhisperIds();
  res.status(200);
  res.send(result);
});

router.post('/identities', async (req, res) => {
  let result = await whisperWrapper.createIdentity();
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
  let result = await whisperWrapper.getMessages(req.params.myId, req.params.topicId, req.params.contactId);
  res.status(200);
  res.send(result);
});

router.post('/messages/:senderId', async (req, res) => {
  let result;
  // private is a required field to ensure private messages aren't accidentally sent publicly
  if (typeof req.body.private == 'undefined' || !req.body.message) {
    res.status(400);
    res.send({ error: 'Request body must contain following fields: private, message' });
  }
  if (req.body.private) {
    result = await whisperWrapper.sendPrivateMessage(req.params.senderId, req.body.recipientId, req.body.topic, req.body.message);
  } else {
    result = await whisperWrapper.sendPublicMessage(req.params.senderId, req.body.topic, req.body.message);
  }
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
  if (!doc.whisperId || !doc.dataField) {
    res.status(400);
    res.send({ error: 'Following fields must be provided in request body: whisperId, dataField' });
  }
  // Will generate random topic and password to use for this entanglement,
  // and share it with other participants via private Whisper messages
  let result = await whisperWrapper.createEntanglement(doc);
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

// ***** Update an Entanglement *****
//  req.body:
//    dataField: {
//      value: String,
//      dataId: String,
//      description: String
//    },
//    whisperId: 0x... (required)
//    acceptedRequest: Boolean (optional)
router.put('/entanglements/:entanglementId', async (req, res) => {
  let result;
  if (req.body.acceptedRequest === true) {
    // Set acceptedRequest for my whisperId to 'true'
    result = await whisperWrapper.acceptEntanglement(req.params.entanglementId, req.body);
    // TODO subsribe to the public whisper channel here
  } else {
    result = await whisperWrapper.updateEntanglement(req.params.entanglementId, req.body);
  }
  res.status(200);
  res.send(result);
});

async function initialize(ipAddress, port) {
  contactUtils = new ContactUtils();
  whisperWrapper = new WhisperWrapper(ipAddress, port);
  let connected = await whisperWrapper.isConnected();
  await whisperWrapper.loadWhisperIds();
  return connected;
}

module.exports = {
  router: router,
  initialize: initialize
};
