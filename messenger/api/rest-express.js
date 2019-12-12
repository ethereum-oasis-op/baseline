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

router.all('/messages*', async (req, res, next) => {
  let validId = await messenger.findIdentity(req.headers['x-messenger-id']);
  if (!validId) {
    res.status(400);
    res.send({ error: "Valid messenger identity not provider in 'x-messenger-id' header." })
    return;
  }
  next();
});

// Fetch messages from all conversations
router.get('/messages', async (req, res) => {
  let myId = req.headers['x-messenger-id'];
  let result = await messenger.getMessages(myId, undefined, req.query.partnerId, req.query.since);
  res.status(200);
  res.send(result);
});

// Fetch messages from all conversations
router.get('/messages/:messageId', async (req, res) => {
  let result = await messenger.getSingleMessage(req.params.messageId);
  if (!result) {
    res.status(404);
    res.send({ error: `Message with id ${req.params.messageId} was not found.` });
    return;
  }
  res.status(200);
  res.send(formatMessageHelper(result));
});

router.post('/messages', async (req, res) => {
  let myId = req.headers['x-messenger-id'];
  if (!req.body.payload) {
    res.status(400);
    res.send({ error: 'Request body must contain following fields: payload, recipientId' });
    return;
  }
  let result = await messenger.sendPrivateMessage(myId, req.body.recipientId, undefined, req.body.payload);
  res.status(201);
  res.send(result);
});

function formatMessageHelper(message){
  return({
    id: message._id,
    scope: message.messageType,
    senderId: message.senderId,
    sentDate: message.timestamp,
    recipientId: message.recipientId,
    deliveredDate: message.ackDate,
    payload: message.payload
  });
}

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
