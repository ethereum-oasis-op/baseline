const express = require('express');
const router = express.Router();
const logger = require('winston');
const { getClient } = require('../utils/getClient.js');
const Config = require('../../config');

let messenger;

/**
 * @api {get} /health Check the health status and the Web3 client connection
 * @apiName HealthCheck
 * @apiGroup Health
 * @apiSuccess {Object} connected If client is connected
 * @apiSuccess {Object} type The type of messaging client connected
 */
router.get('/health', async (req, res) => {
  const result = await messenger.isConnected();
  res.status(200);
  res.send({ connected: result, type: Config.messagingType });
});

/**
 * @api {get} /identities Get the client account identities
 * @apiDescription A list of the client (whisper) user accounts stored
 * in the DB. Public and private keys are stored, only public returned.
 * @apiName GetIdentities
 * @apiGroup Identity
 * @apiSuccess {Object[]} List of identities stored in the DB
 */
router.get('/identities', async (req, res) => {
  const result = await messenger.getIdentities();
  res.status(200);
  res.send(result);
});

/**
 * @api {post} /identities Create a new identity in the client and stores it
 * @apiDescription Accepts no params, it will initiate a request to the connected
 * client to create a new identity for use in sending messages. The
 * new Identity will be stored in the database.
 * @apiName PostIdentities
 * @apiGroup Identity
 */
router.post('/identities', async (req, res) => {
  const result = await messenger.createIdentity();
  // TODO: do we need to add this identity to the Registry smart contract?
  res.status(201);
  res.send(result);
});

// Filter to catch all messages and require an identity header
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

/**
 * @api {get} /messages Get messages scoped to a specific user
 * @apiName GetMessages
 * @apiGroup Messages
 * @apiHeader {String} x-messenger-id The Id of the identity to use for all /messages filtering
 */
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

/**
 * @api {get} /messages/:messageId Get a specific message
 * @apiDescription Return a specific message
 * @apiName GetMessagesByID
 * @apiGroup Messages
 * @apiParam {String} messageId Unique message Id
 * @apiHeader {String} x-messenger-id The Id of the identity to use for all /messages filtering
 */
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

/**
 * @api {post} /messages Create a new message
 * @apiDescription Create a new message to send via the connected client
 * @apiName PostMessage
 * @apiGroup Messages
 * @apiHeader {String} x-messenger-id The Id of the identity to use for all /messages filtering
 * @apiParam {Object} payload The object to send (Base64 encoded?)
 * @apiParam {Object} recipient Message Identity ID of where to send the message
 */
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
  logger.info('Initializing server...');
  messenger = await getClient();
  const connected = await messenger.isConnected();
  await messenger.loadIdentities();
  await messenger.createFirstIdentity();

  return connected;
}

module.exports = {
  router,
  initialize,
};
