const logger = require('winston');
const { getClient } = require('../utils/getClient.js');

export default async (job, done) => {
  logger.info('Processing sendMessage.');
  const { senderId, recipientId, payload } = job.data;
  const messenger = await getClient();
  let message;
  try {
    message = await messenger.sendPrivateMessage(senderId, recipientId, undefined, payload);
  } catch (error) {
    logger.error('Error', error);
  }
  done(null, { message });
};
