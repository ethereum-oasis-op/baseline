import db from './utils/db';
import app from './app';
import { checkForNewVks } from './utils/fileToDB';
const { logger } = require('radish34-logger');

const main = async () => {
  const port = 80;
  try {
    await db.connect();
    await checkForNewVks();
    app.listen(port, () => logger.info(`REST based ZKP Microservice server listening on port ${port}`, { service: 'ZKP' }));
  } catch (err) {
    logger.error(err, { service: 'ZKP' });
    process.exit(1);
  }
};

main();
