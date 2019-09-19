import db from './db';
import { startServer } from './app';

const main = async () => {
  try {
    await db.connect();
    startServer();
  }
  catch (err) {
    console.log(err);
  }
}

main();
