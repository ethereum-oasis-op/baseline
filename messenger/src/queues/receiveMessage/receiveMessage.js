import dbConnect from '../../../../../db/connect';
import {
  addReceiptToBaselineTaskGroupById,
  getBaselineTaskGroupById,
} from '../../../../../db/models/baseline/baselineTaskGroup';

export default async (job, done) => {
  console.log(`---> Processing job (${job.id}) for receiveMessage`);
  await dbConnect();
  try {
    const { type } = job.data;
    console.log(`*** Received a ${type} message from whisper. Processing now...`);
    if (type === 'delivery_receipt') {
      const { origMessageId, deliveredDate } = job.data;
      await addReceiptToBaselineTaskGroupById(origMessageId, deliveredDate);
    }
    done(null, job.data);
  } catch (error) {
    console.error('Error', error);
  }
};
