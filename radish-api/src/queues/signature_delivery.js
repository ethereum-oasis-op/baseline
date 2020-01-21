import Queue from 'bull';
import { setQueues } from 'bull-board';

const sigDeliveryQueue = new Queue('signature-delivery', process.env.REDIS_URL);
// Adding Queue to BullBoard Admin UI
setQueues(sigDeliveryQueue);

// In-line worker using sandboxed processor
// Need to use absolute instead of relative filepath
sigDeliveryQueue.process('/app/dist/workers/signature_delivery.js');

module.exports = sigDeliveryQueue;
