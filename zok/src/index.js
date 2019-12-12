import app from './app';

const main = async () => {
  try {
    app.listen(80);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

main();
