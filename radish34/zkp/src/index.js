import db from './utils/db';
import app from './app';
import { checkForNewVks } from './utils/fileToDB';
import { logger } from 'radish34-logger';

const main = async () => {
  logger.info('Starting express ...', { service: 'ZKP' });
  const port = 80;
  try {
    await db.connect();
    await checkForNewVks();
    app.listen(port, () => logger.info(`REST based zkp microservice server listening on port ${port}.`, { service: 'ZKP' }));
  } catch (err) {
    logger.error('%o', {error: err}, { service: 'ZKP' });
    process.exit(1);
  }
};

main();
