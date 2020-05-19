const { getClient } = require('../utils/getClient.js');
const { logger } = require('radish34-logger');

export default async (job, done) => {
  logger.info('Processing sendMessage.');
  const { senderId, recipientId, payload } = job.data;
  const messenger = await getClient();
  let message;
  try {
    message = await messenger.sendPrivateMessage(senderId, recipientId, undefined, payload);
  } catch (err) {
    logger.error('\n%o', err, { service: 'MESSENGER' });
  }
  done(null, { message });
};
