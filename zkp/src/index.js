import db from './utils/db';
import app from './app';
import { checkForNewVks } from './utils/fileToDB';

const main = async () => {
  try {
    await db.connect();
    await checkForNewVks();
    app.listen(80);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

main();
