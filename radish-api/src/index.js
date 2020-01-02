import db from './db.js';
import startServer from './app';
import { loadServerSettingsFromFile } from './utils/serverSettings';
import { subscribeRegisterOrgEvent } from './services/event';
import { saveOrganizations } from './services/organization';

const main = async () => {
  try {
    await db.connect();
    await loadServerSettingsFromFile();
    await saveOrganizations();
    await subscribeRegisterOrgEvent();
    startServer();
  } catch (err) {
    console.log(err);
  }
};

main();
