const Web3 = require('web3');
const Config = require('../../../config');
const { logger } = require('radish34-logger');

const userIndex = process.env.USER_INDEX || 0;
const { messengerPort } = Config.users[userIndex];
const { ipAddress } = Config.users[userIndex];

let web3client;

// Function that checks connection
async function isConnected() {
  let connected = false;
  if (typeof web3client !== 'undefined') {
    connected = await web3client.eth.net.isListening();
  }
  return connected;
}

// Function that gets the web3 instance
async function getWeb3() {
  if (typeof web3client === 'undefined') {
    // set the provider you want from Web3.providers
    const nodeUrl = `ws://${ipAddress}:${messengerPort}`;
    logger.debug(`Creating initial Web3 connection to ${nodeUrl}.`, { service: 'MESSENGER' });
    const newClient = await new Web3.providers.WebsocketProvider(
      nodeUrl,
      { headers: { Origin: 'mychat2' } },
    );
    web3client = await new Web3(newClient);
  } else if (await isConnected()) {
    web3client = await new Web3(web3client.currentProvider);
  } else {
    logger.debug('Web3 connection missing. Will open a new one.', { service: 'MESSENGER' });
    const newClient = await new Web3.providers.WebsocketProvider(
      `ws://${ipAddress}:${messengerPort}`,
      { headers: { Origin: 'mychat2' } },
    );
    web3client = await new Web3(newClient);
  }
  return web3client;
}

module.exports = {
  getWeb3,
  isConnected,
};
