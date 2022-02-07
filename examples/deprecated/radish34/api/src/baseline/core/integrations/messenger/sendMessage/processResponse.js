import { logger } from 'radish34-logger';

export default (job, done) => {
  try {
    done(null, { message: 'API: Process Response', jobData: job.data });
  } catch (err) {
    logger.error('\n%o', err, { service: 'API' });
  }
};
