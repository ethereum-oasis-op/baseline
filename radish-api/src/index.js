import db from './db';
import startServer from './app';
import { loadServerSettingsFromFile, getServerSettings } from './utils/serverSettings';

const main = async () => {
  try {
    await db.connect();
    await loadServerSettingsFromFile();
    await getServerSettings();
    startServer();
  } catch (err) {
    console.log(err);
  }
};

main();
