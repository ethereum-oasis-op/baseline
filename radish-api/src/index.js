import db from './db';
import startServer from './app';
import { loadServerSettingsFromFile } from './utils/serverSettings';
import { subscribeRegisterOrgEvent } from './services/event';
import { saveOrganizations } from './services/organization';

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
  } catch (err) {
    console.log(err);
  }
};

main();
