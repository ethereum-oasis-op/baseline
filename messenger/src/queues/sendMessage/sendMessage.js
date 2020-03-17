const mongoose = require('mongoose');
const { getClient } = require('../../utils/getClient.js');

module.exports = async (job, done) => {
  console.log(`---> Processing job (${job.id}) for sendMessage`);

  const {
    baselineId, taskId, params, options,
  } = job.data;
  const key = options && options.messages ? options.messages : '';
  const messages = params[key];
  // console.log('options', options);
  const messenger = await getClient();
  job.progress(10);

  // Cannot use pre-established mongoose connection because this code runs in
  // a separate sandbox process
  const dbOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  };
  await mongoose.connect(`${process.env.MONGO_URL}/radish34`, dbOptions);
  job.progress(20);

  console.log('MESSSSSSSSSSSSSSAGES', messages);

  const sending = messages.map((message) => messenger.sendPrivateMessage(
    message.senderId,
    message.recipientId,
    undefined,
    message.payload,
  ));

  const receipts = await Promise.all(sending);
  const messageIds = receipts.map((receipt) => ({
    recipientId: receipt.recipientId,
    messageId: receipt._id,
  }));
  // console.log('Message sent via queue=', messageIds);

  job.progress(90);
  await mongoose.connection.close();

  job.progress(100);
  done(null, { baselineId, taskId, result: { messageIds } });
};
