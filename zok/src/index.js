import app from './app';

const main = async () => {
  try {
    app.listen(80);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    process.exit(1);
    process.kill(process.pid, 'SIGTERM');
  }
};

main();
