const Queue = require('bull');
const { setQueues } = require('bull-board');
const Config = require('../../../config');
const { logger } = require('radish34-logger');

const requestNamespace = `baseline:messenger:sendMessage:req`;
const responseNamespace = `baseline:messenger:sendMessage:res`;

let sendMessageReqQueue;
let sendMessageResQueue;

try {
  sendMessageReqQueue = new Queue(requestNamespace, Config.users[0].redisUrl);
  logger.debug(`Successfully connected to bull queue "${requestNamespace}" at ${Config.users[0].redisUrl}.`, { service: 'MESSENGER' });
  sendMessageResQueue = new Queue(responseNamespace, Config.users[0].redisUrl);
  logger.debug(`Successfully connected to bull queue "${responseNamespace}" at ${Config.users[0].redisUrl}.`, { service: 'MESSENGER' });
} catch (error) {
  logger.error(`Could not connect to bull queue "baseline:messenger:sendMessage" at ${Config.users[0].redisUrl}.`, { service: 'MESSENGER' });
}

// Adding Queue to BullBoard Admin UI
setQueues([sendMessageReqQueue, sendMessageResQueue]);

sendMessageReqQueue.process(`${__dirname}/processSendMessage.js`);

module.exports = {
  sendMessageReqQueue,
  sendMessageResQueue,
};
