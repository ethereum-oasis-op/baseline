import db from './utils/db';
import app from './app';

const main = async () => {
  try {
    await db.connect();
    app.listen(80);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

main();
