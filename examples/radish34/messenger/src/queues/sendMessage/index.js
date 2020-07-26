const Queue = require('bull');
const { setQueues } = require('bull-board');
const Config = require('../../../config');
const { logger } = require('radish34-logger');

const requestNamespace = `baseline:messenger:sendMessage:req`;
const responseNamespace = `baseline:messenger:sendMessage:res`;

let sendMessageReqQueue;
let sendMessageResQueue;

try {
  sendMessageReqQueue = new Queue(requestNamespace, Config.redisUrl);
  logger.debug(`SUCCESS: connected to bull queue "${requestNamespace}" at ${Config.redisUrl}`);
  sendMessageResQueue = new Queue(responseNamespace, Config.redisUrl);
  logger.debug(`SUCCESS: connected to bull queue "${responseNamespace}" at ${Config.redisUrl}`);
} catch (error) {
  logger.error(`ERROR: could not connect to bull queue "baseline:messenger:sendMessage" at ${Config.redisUrl}`);
}

// Adding Queue to BullBoard Admin UI
setQueues([sendMessageReqQueue, sendMessageResQueue]);

sendMessageReqQueue.process(`${__dirname}/processSendMessage.js`);

module.exports = {
  sendMessageReqQueue,
  sendMessageResQueue,
};
