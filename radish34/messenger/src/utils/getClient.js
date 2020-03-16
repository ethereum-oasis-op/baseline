const WhisperWrapper = require('../clients/whisper/WhisperWrapper');
const web3utils = require('../clients/whisper/web3Utils.js');
const Config = require('../../config');

async function getClient() {
  let messenger;
  switch (Config.messagingType) {
    case 'whisper':
      messenger = await new WhisperWrapper();
      await web3utils.getWeb3();
      break;
    default:
      messenger = await new WhisperWrapper();
      await web3utils.getWeb3();
  }
  return messenger;
}

module.exports = {
  getClient,
};
