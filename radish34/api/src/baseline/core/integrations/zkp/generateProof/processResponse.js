import { logger } from 'radish34-logger';

export default (job, done) => {
  try {
    done(null, job.data);
  } catch (err) {
    logger.error('\n%o', err, { service: 'API' });
  }
};
