const express = require('express');

const router = express.Router();
const Config = require('../config');
const WhisperWrapper = require('../src/WhisperWrapper');
const web3utils = require('../src/web3Utils.js');

let messenger;

router.get('/health-check', async (req, res) => {
  res.status(200);
  res.send({ serverAlive: true });
});

router.get('/health-check/client', async (req, res) => {
  const result = await messenger.isConnected();
  res.status(200);
  res.send({ connected: result, type: Config.messagingType });
});

router.get('/identities', async (req, res) => {
  const result = await messenger.getIdentities();
  res.status(200);
  res.send(result);
});

router.post('/identities', async (req, res) => {
  const result = await messenger.createIdentity();
  // TODO: do we need to add this identity to the Registry smart contract?
  res.status(201);
  res.send(result);
});

router.all('/messages*', async (req, res, next) => {
  const validId = await messenger.findIdentity(req.headers['x-messenger-id']);
  if (!validId) {
    res.status(400);
    res.send({
      error: "Valid messenger identity not provider in 'x-messenger-id' header.",
    });
    return;
  }
  next();
});

// Message format helper
function formatMessageHelper(message) {
  return {
    id: message._id,
    scope: message.messageType,
    senderId: message.senderId,
    sentDate: message.sentDate,
    recipientId: message.recipientId,
    deliveredDate: message.deliveredDate,
    payload: message.payload,
  };
}

// Fetch messages from all conversations
router.get('/messages', async (req, res) => {
  const myId = req.headers['x-messenger-id'];
  const messages = await messenger.getMessages(
    myId,
    undefined,
    req.query.partnerId,
    req.query.since,
  );
  const formattedMessages = [];
  await messages.forEach(async (message) => {
    await formattedMessages.push(formatMessageHelper(message));
  });
  res.status(200);
  res.send(formattedMessages);
});

// Fetch messages from all conversations
router.get('/messages/:messageId', async (req, res) => {
  const result = await messenger.getSingleMessage(req.params.messageId);
  if (!result) {
    res.status(404);
    res.send({
      error: `Message with id ${req.params.messageId} was not found.`,
    });
    return;
  }
  res.status(200);
  res.send(formatMessageHelper(result));
});

router.post('/messages', async (req, res) => {
  const myId = req.headers['x-messenger-id'];
  if (!req.body.payload) {
    res.status(400);
    res.send({
      error: 'Request body must contain following fields: payload, recipientId',
    });
    return;
  }
  const result = await messenger.sendPrivateMessage(
    myId,
    req.body.recipientId,
    undefined,
    req.body.payload,
  );
  res.status(201);
  res.send(result);
});

async function initialize() {
  // Retrieve messenger instance and pass to helper classes
  // Modularized here to enable use of other messenger services in the future
  console.log('Initializing server...');
  if (Config.messagingType === 'whisper') {
    messenger = await new WhisperWrapper();
    await web3utils.getWeb3();
  }
  const connected = await messenger.isConnected();
  await messenger.loadIdentities();
  await messenger.createFirstIdentity();

  return connected;
}

module.exports = {
  router,
  initialize,
};
