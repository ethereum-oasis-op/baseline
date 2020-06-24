const { messagingServiceFactory } = require('@baseline-protocol/messaging');
const logger = require('winston');
const Config = require('../../config');
const { getIdentities, addIdentity } = require('../db/interactions');
const { DEFAULT_TOPIC } = require('../utils/generalUtils');
const { processWhisperMessage } = require('./callbacks');

let messenger;

async function initialize() {
  // Retrieve messenger instance and pass to helper classes
  // Modularized here to enable use of other messenger services in the future
  logger.info('Initializing server...');
  messenger = await messagingServiceFactory(provider = 'whisper', { clientUrl: Config.clientUrl });
  await messenger.connect();
  const connected = await messenger.isConnected();

  // Retrieve pre-existing whisper identities from db and load into geth node
  // (this must be done each time the geth node is restarted)
  if (Config.messagingType === 'whisper') {
    const identities = await getIdentities();
    const loadedIds = await messenger.loadIdentities(identities, DEFAULT_TOPIC, processWhisperMessage);
    // Update keyIds in db
    await loadedIds.forEach((id) => addIdentity(id));
  }
  return connected;
}

async function getMessenger() {
  if (!messenger) {
    await initialize();
  }
  return messenger;
}

module.exports = {
  getMessenger,
  initialize,
};
