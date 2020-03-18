const Queue = require('bull');
const logger = require('winston');
const { setQueues } = require('bull-board');
const Config = require('../../../config');

const requestNamespace = `baseline:messenger:receiveMessage:req`;
let receiveMessageQueue;

try {
  receiveMessageQueue = new Queue(requestNamespace, Config.users[0].redisUrl);
  logger.debug(`SUCCESS: connected to bull queue "${requestNamespace}" at ${Config.users[0].redisUrl}`);
} catch (error) {
  logger.error(`ERROR: could not connect to bull queue "${requestNamespace}" at ${Config.users[0].redisUrl}`);
}

// Adding Queue to BullBoard Admin UI
setQueues(receiveMessageQueue);

// Queue listener
receiveMessageQueue.on('global:completed', async (job, data) => {
  logger.debug('MESSENGER: forwarded message processed by other service', data);
});

module.exports = {
  receiveMessageQueue,
};
