import messenger from '../utils/messengerWrapper';
import { originationUpdate, RFP } from '../integrations/rfp';
import mongoose from 'mongoose';

module.exports = async (job, done) => {
  const { data: doc } = job;
  console.log(`BullJS delivering message (uuid: ${doc.documentId})`);
  const message = (await messenger.createMessage(doc.senderId, doc.recipientId, doc.payload)).data;
  job.progress(50);

  console.log('BullJS updating the origination messageId to', message._id);
  const dbFullName = `${process.env.MONGO_URL}/${process.env.MONGO_DB_NAME}`;
  await mongoose.connect(dbFullName, { useNewUrlParser: true });

  await originationUpdate(message._id, message.recipientId, doc.documentId);
  job.progress(90);

  await mongoose.connection.close();
  job.progress(100);
  done();
};
