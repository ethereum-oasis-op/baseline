import db from './db';
import startServer from './app';
import { loadServerSettingsFromFile } from './utils/serverSettings';
import { subscribeRegisterOrgEvent } from './services/event';
import { saveOrganizations } from './services/organization';
import { startEventFilter } from './services/merkle-tree';
import { logger } from 'radish34-logger';

const main = async () => {
  try {
    // Setup
    await db.connect();
    await db.connectMongoose();
    await loadServerSettingsFromFile();

    // Healthcheck
    startServer();

    // Sanity Check
    await saveOrganizations();
    await subscribeRegisterOrgEvent();

    // filter for NewLeaves in the shield contract:
    await startEventFilter();
  } catch (err) {
    logger.error('\n%o', err, { service: 'API' });
  }
};

main();
