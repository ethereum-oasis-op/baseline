const Web3 = require('web3');
const fs = require('fs');

const POW_TIME = 5;
const TTL = 10;
const DEFAULT_TOPIC = "0x11223344";

let web3_1, keyId_1;
let sent_1 = 0;
let web3_2, keyId_2, pubKey_2;
let received_2 = 0;

// Config settings
let whisper_port_1, geth_ip_address_1;
let whisper_port_2, geth_ip_address_2;
let num_messages, delay, pow_target;

// Statistics
let durations = [];

// Get whisper websocket info from config file
async function getConfig() {
  let rawContents = await fs.readFileSync('./config/nodes.json');
  let contents = JSON.parse(rawContents);

  whisper_port_1 = contents[`node_1`].whisper_port;
  geth_ip_address_1 = contents[`node_1`].ip_address;
  whisper_origin_1 = contents[`node_1`].origin;

  whisper_port_2 = contents[`node_2`].whisper_port;
  geth_ip_address_2 = contents[`node_2`].ip_address;
  whisper_origin_2 = contents[`node_2`].origin;

  num_messages = contents.whisper_test_params.num_messages;
  delay = contents.whisper_test_params.delay_ms;
  pow_target = contents.whisper_test_params.pow_target;
}

async function setupNode1() {
  web3_1 = new Web3();
  await web3_1.setProvider(new Web3.providers.WebsocketProvider(`ws://${geth_ip_address_1}:${whisper_port_1}`, { headers: { Origin: 'mychat2' } }));
  keyId_1 = await web3_1.shh.newKeyPair();
  pubKey_1 = await web3_1.shh.getPublicKey(keyId_1);
  privKey_1 = await web3_1.shh.getPrivateKey(keyId_1);
  try {
    await web3_1.shh.subscribe("messages", {
      minPow: pow_target,
      privateKeyID: keyId_1,
      topics: [DEFAULT_TOPIC]
    }).on('data', async (data) => {
      received_1++;
    }).on('error', (err) => {
      console.log('Message receive error: ', err);
    });
  } catch (err) {
    console.log('Subscription error: ', err);
  }
  return;
}

async function setupNode2() {
  web3_2 = new Web3();
  await web3_2.setProvider(new Web3.providers.WebsocketProvider(`ws://${geth_ip_address_2}:${whisper_port_2}`, { headers: { Origin: 'mychat2' } }));
  keyId_2 = await web3_2.shh.newKeyPair();
  pubKey_2 = await web3_2.shh.getPublicKey(keyId_2);
  privKey_2 = await web3_2.shh.getPrivateKey(keyId_2);
  try {
    await web3_2.shh.subscribe("messages", {
      minPow: pow_target,
      privateKeyID: keyId_2,
      topics: [DEFAULT_TOPIC]
    }).on('data', async (data) => {
      let time = new Date().getTime();
      let content = await web3_2.utils.toAscii(data.payload);
      let messageObj = JSON.parse(content);
      let diff = time - messageObj.time;
      durations[messageObj.num] = diff;
      console.log(`Received message ${messageObj.num}, sent: ${messageObj.time}, delivery time(ms): ${diff}`);
      received_2++;
    }).on('error', (err) => {
      console.log('Message receive error: ', err);
    });
  } catch (err) {
    console.log('Subscription error: ', err);
  }
  return;
}

async function sendMessage(messageJSON) {
  let hash;
  messageJSON.time = await new Date().getTime();
  let message = await JSON.stringify(messageJSON)
  let content = await web3_1.utils.fromAscii(message);
  try {
    hash = web3_1.shh.post({
      pubKey: pubKey_2,
      sig: keyId_1,
      ttl: TTL,
      topic: DEFAULT_TOPIC,
      payload: content,
      powTime: POW_TIME,
      powTarget: pow_target
    });
    sent_1++;
  } catch (err) {
    console.error('Message send error: ', err);
    return;
  }
  return hash;
}

var wait = ms => new Promise((r, j) => setTimeout(r, ms))

async function runTest() {
  await getConfig();
  await setupNode1();
  await setupNode2();
  for (let i = 1; i <= num_messages; i++) {
    // Delay before printing stats
    sendMessage({ num: i });
    await wait(delay);
  }
}

function calculateAvg() {
  let sum = 0;
  let count = 0;
  durations.sort();
  durations.forEach((duration) => {
    count++;
  });
  let percentileIndex = Math.floor(count * 0.99);
  for (let i = 0; i < count; i++) {
    sum = sum + durations[i];

  }
  return Math.ceil(sum / percentileIndex);
}

runTest().then(async () => {
  await wait(10000);
  let messagesDropped = sent_1 - received_2;
  console.log('');
  console.log('--------- Settings ---------------------------------------');
  console.log('*** Delay (ms): ', delay);
  console.log('*** PoW target: ', pow_target);
  console.log('*** Messages sent: ', sent_1);
  console.log('');
  console.log('--------- Results ----------------------------------------');
  let ratio = (received_2 / sent_1) * 100;
  console.log(`*** Delivery %: ${ratio} (${messagesDropped} dropped)`);
  let avgTime = await calculateAvg();
  console.log('*** Avg. delivery time, fastest 99% (ms): ', avgTime);
  console.log('');
  process.exit();
});
