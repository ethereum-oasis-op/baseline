import messenger from '../utils/messengerWrapper';
import { originationUpdate } from '../integrations/rfp';

module.exports = async (job, done) => {
  const { data: doc } = job;
  console.log(`BullJS delivering message (uuid: ${doc.documentId})`);
  const message = (await messenger.createMessage(doc.senderId, doc.recipientId, doc.payload)).data;
  job.progress(50);

  console.log('BullJS updating the origination messageId to', message._id);
  await originationUpdate(message._id, message.recipientId, doc.documentId);
  job.progress(100);
  done();
};
