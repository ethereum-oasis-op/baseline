import db from './db';
import startServer from './app';
import { loadServerSettingsFromFile } from './utils/serverSettings';

const main = async () => {
  try {
    await db.connect();
    await loadServerSettingsFromFile();
    startServer();
  } catch (err) {
    console.log(err);
  }
};

main();
