import Queue from 'bull';
import { setQueues } from 'bull-board';

const msgDeliveryQueue = new Queue('message-delivery', process.env.REDIS_URL);
// Adding Queue to BullBoard Admin UI
setQueues(msgDeliveryQueue);

// In-line worker using sandboxed processor
// Need to use absolute instead of relative filepath
msgDeliveryQueue.process('/app/dist/queues/workers/message_delivery.js');

module.exports = msgDeliveryQueue;
