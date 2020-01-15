import messenger from '../utils/messengerWrapper';

module.exports = async (job, done) => {
  const { data: message } = job;
  console.log('BullJS is delivering the message...', message);
  await messenger.createMessage(message.senderId, message.recipientId, message.payload);
  job.progress(100);
  done();
};
