const sendMessage = require('./index');

module.exports = async (job, done) => {
  try {
    const sendMessageJob = await sendMessage.sendMessageQueue.add(job.data);
    await sendMessage.ackQueue.add({ jobId: sendMessageJob.id, ...job.data });
    // await sendMessage.sendMessageQueue.add({ jobId: sendMessageJob.id, ...job.data });
    done(null, { jobId: sendMessageJob.id, ...job.data });
  } catch (error) {
    console.error('Error', error);
  }
};
