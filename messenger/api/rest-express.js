'use strict';

const express = require('express');
const router = express.Router();
const Config = require('../config');
const WhisperWrapper = require('../src/WhisperWrapper');

let messenger;

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

// Fetch messages from private 1:1 conversation
router.get('/messages/:myId', async (req, res) => {
  let result = await messenger.getMessages(req.params.myId, undefined, undefined, req.query.since);
  res.status(200);
  res.send(result);
});

// Fetch messages from private 1:1 conversation
router.get('/messages/:myId/contacts/:contactId', async (req, res) => {
  let result = await messenger.getMessages(req.params.myId, undefined, req.params.contactId, req.query.since);
  res.status(200);
  res.send(result);
});

router.post('/messages/:senderId', async (req, res) => {
  if (!req.body.message) {
    res.status(400);
    res.send({ error: 'Request body must contain following fields: message' });
    return;
  }
  let result = await messenger.sendPrivateMessage(req.params.senderId, req.body.recipientId, undefined, req.body.message);
  res.status(200);
  res.send(result);
});

async function initialize(ipAddress, port) {
  // Retrieve messenger instance and pass to helper classes
  // Modularized here to enable use of other messenger services in the future
  console.log('Initializing server...');
  if (Config.messaging_type === "whisper") {
    messenger = await new WhisperWrapper();
    await messenger.configureProvider(ipAddress, port);
  }
  let connected = await messenger.isConnected();
  await messenger.loadIdentities();

  return connected;
}

module.exports = {
  router: router,
  initialize: initialize
};
