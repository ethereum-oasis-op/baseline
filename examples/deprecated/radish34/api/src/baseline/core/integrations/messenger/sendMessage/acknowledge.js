import { logger } from 'radish34-logger';

export default (job, done) => {
  try {
    // Update Baseline to say that it's in motion
    done(null, { message: 'Acknowledge done', jobData: job.data });
  } catch (err) {
    logger.error('\n%o', err, { service: 'API' });
  }
};
