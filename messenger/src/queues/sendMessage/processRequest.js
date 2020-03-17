const sendMessage = require('./index');

module.exports = async (job, done) => {
  try {
    console.log(`---> Processing job (${job.id}) for sendMessage:req`, job.data);

    const sendMessageJob = await sendMessage.sendMessageQueue.add(job.data);
    console.log(`---> Added job (${sendMessageJob.id}) to sendMessage`);
    job.progress(50);

    const ackJob = await sendMessage.ackQueue.add({ jobId: sendMessageJob.id, ...job.data });
    console.log(`<--- Added job (${ackJob.id}) to sendMessage:ack`);
    job.progress(100);
    done(null, { jobId: sendMessageJob.id, ...job.data });
  } catch (error) {
    console.error('Error', error);
  }
};
