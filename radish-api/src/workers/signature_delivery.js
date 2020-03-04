import mongoose from 'mongoose';
import messenger from '../utils/messengerWrapper';
import { signatureSentUpdate } from '../db/models/modules/rfps';

module.exports = async (job, done) => {
  const { data: jobData } = job;
  console.log(`BullJS delivering message (uuid: ${jobData.documentId})`);
  const message = await messenger.createMessage(
    jobData.senderId,
    jobData.recipientId,
    jobData.payload,
  ).data;
  job.progress(50);

  console.log('BullJS updating the origination messageId to', message._id);
  // Cannot use pre-established mongoose connection because this code runs in
  // a separate sandbox process
  const dbFullName = `${process.env.MONGO_URL}/${process.env.MONGO_DB_NAME}`;
  const dbOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  };
  await mongoose.connect(dbFullName, dbOptions);

  // Assume we're only working with RFPs for now ??
  const result = await signatureSentUpdate(message._id, jobData.senderId, jobData.documentId);
  // TODO: if failed, error
  job.progress(90);

  await mongoose.connection.close();
  job.progress(100);
  done();
};
