const { setQueues } = require('bull-board');
const Queue = require('bull');

const receiveMessageNamespace = 'baseline:messenger:receiveMessage';
const receiveMessageQueue = new Queue(receiveMessageNamespace, process.env.REDIS_URL);
receiveMessageQueue.process(`${__dirname}/receiveMessage.js`);

// Adding Queue to BullBoard Admin UI
setQueues([receiveMessageQueue]);

module.exports = {
  receiveMessageQueue,
};
