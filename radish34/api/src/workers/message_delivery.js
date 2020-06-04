import mongoose from 'mongoose';
import messenger from '../utils/messengerWrapper';
import { originationUpdate } from '../db/models/modules/rfps';
import { logger } from 'radish34-logger';

module.exports = async (job, done) => {
  const { data: doc } = job;
  logger.info(`BullJS delivering message with uuid: ${doc.documentId}.`, { service: 'API'});
  const message = (await messenger.createMessage(doc.senderId, doc.recipientId, doc.payload)).data;
  job.progress(50);

  logger.info(`BullJS updating the origination messageId to ${message._id}.`, { service: 'API'});
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
  await originationUpdate(message._id, message.recipientId, doc.documentId);
  job.progress(90);

  await mongoose.connection.close();
  job.progress(100);
  done();
};
