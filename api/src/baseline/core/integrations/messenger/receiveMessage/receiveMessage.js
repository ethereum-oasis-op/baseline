import { connect as dbConnect, disconnect as dbDisconnect } from '../../../../../db/connect';
import { addReceiptToBaselineTaskGroupById } from '../../../../../db/models/baseline/baselineTaskGroup';
import messageResolvers from '../../../../ messageResolvers';

export default async (job, done) => {
  console.log(`---> Processing job (${job.id}) for receiveMessage`);
  job.progress(10);
  await dbConnect();
  try {
    const { type } = job.data;
    console.log(`*** Received a ${type} message from whisper. Processing now...`);
    if (type === 'delivery_receipt') {
      const { origMessageId, deliveredDate } = job.data;
      await addReceiptToBaselineTaskGroupById(origMessageId, deliveredDate);
      console.log('Received a delivery_receipt from whisper:', job.data);
    } else {
      console.log(`Received a ${type} message from whisper:`, job.data);
      const myFunc = messageResolvers[type];
      await myFunc(job.data);
    }
    job.progress(90);
  } catch (error) {
    console.error('Error', error);
  }
  await dbDisconnect();
  job.progress(100);
  done(null, job.data);
};
