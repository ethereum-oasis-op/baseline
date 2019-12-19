const Web3 = require('web3');
const Config = require('../config');

const nodeNum = process.env.NODE_NUM || 1;
const { whisperPort } = Config.nodes[`node_${nodeNum}`];
const { ipAddress } = Config.nodes[`node_${nodeNum}`];

let web3client;

async function isConnected() {
  let connected = false;
  if (typeof web3client !== 'undefined') {
    connected = await web3client.eth.net.isListening();
  }
  return connected;
}

async function getWeb3() {
  if (typeof web3client === 'undefined') {
    // set the provider you want from Web3.providers
    console.log('Creating initial Web3 connection');
    const newClient = await new Web3.providers.WebsocketProvider(
      `ws://${ipAddress}:${whisperPort}`,
      { headers: { Origin: 'mychat2' } },
    );
    web3client = await new Web3(newClient);
  } else if (await isConnected()) {
    web3client = await new Web3(web3client.currentProvider);
  } else {
    console.log('Web3 connection missing. Will open a new one');
    const newClient = await new Web3.providers.WebsocketProvider(
      `ws://${ipAddress}:${whisperPort}`,
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
