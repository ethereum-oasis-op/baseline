import Web3 from 'web3';
import logger from 'winston';
const Config = require('../../../../../../messenger-tmp/config');

const userIndex = process.env.USER_INDEX || 0;
const { messengerPort, ipAddress } = Config.whisper.users[userIndex];

let web3client;

// Function that checks connection
export async function isWeb3Connected() {
  let connected = false;
  if (typeof web3client !== 'undefined') {
    connected = await web3client.eth.net.isListening();
  }
  return connected;
}

// Function that gets the web3 instance
export async function getWeb3() {
  if (typeof web3client === 'undefined') {
    // set the provider you want from Web3.providers
    const nodeUrl = `ws://${ipAddress}:${messengerPort}`;
    logger.debug(`Creating initial Web3 connection to ${nodeUrl}`);
    const newClient = await new Web3.providers.WebsocketProvider(
      nodeUrl,
      { headers: { Origin: 'mychat2' } },
    );
    web3client = await new Web3(newClient);
  } else if (await isWeb3Connected()) {
    web3client = await new Web3(web3client.currentProvider);
  } else {
    logger.debug('Web3 connection missing. Will open a new one');
    const newClient = await new Web3.providers.WebsocketProvider(
      `ws://${ipAddress}:${messengerPort}`,
      { headers: { Origin: 'mychat2' } },
    );
    web3client = await new Web3(newClient);
  }
  return web3client;
}
