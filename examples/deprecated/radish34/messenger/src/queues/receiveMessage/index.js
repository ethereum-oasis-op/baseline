const Queue = require('bull');
const { setQueues } = require('bull-board');
const Config = require('../../../config');
const { logger } = require('radish34-logger');

const requestNamespace = `baseline:messenger:receiveMessage:req`;
let receiveMessageQueue;

try {
  receiveMessageQueue = new Queue(requestNamespace, Config.redisUrl);
  logger.debug(`SUCCESS: connected to bull queue "${requestNamespace}" at ${Config.redisUrl}`);
} catch (error) {
  logger.error(`ERROR: could not connect to bull queue "${requestNamespace}" at ${Config.redisUrl}`);
}

// Adding Queue to BullBoard Admin UI
setQueues(receiveMessageQueue);

// Queue listener
receiveMessageQueue.on('global:completed', async (job, data) => {
  logger.debug('Forwarded message processed by other service.\n%o', data, { service: 'MESSENGER' });
});

module.exports = {
  receiveMessageQueue,
};
