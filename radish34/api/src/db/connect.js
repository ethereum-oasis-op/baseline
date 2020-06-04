import mongoose from 'mongoose';
import { logger } from 'radish34-logger';

const { connection } = mongoose;
const mongoURL = `${process.env.MONGO_URL}/${process.env.MONGO_DB_NAME}`;

const onConnected = () => {
  logger.info(`Db conntect to ${mongoURL}.`, { service: 'API' });
};

const onError = err => {
  logger.error('Db error.\n%o', err, { service: 'API' });
};

const onDisconnected = () => {
  logger.info(`Db disconnected from ${mongoURL}.`, { service: 'API' });
};

const onExit = () => {
  connection.close(() => {
    logger.error('Db disconnected due to process exit.', { service: 'API' });
    process.exit();
  });
};

const connect = async () => {
  logger.info(`Db connecting ...`, { service: 'API' });

  mongoose.Promise = global.Promise;

  mongoose.connect(mongoURL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    w: 1,
    j: true,
  });

  connection.on('connected', onConnected);
  connection.on('error', onError);
  connection.on('disconnected', onDisconnected);
  process.on('SIGINT', onExit);

  return mongoose.connection;
};

export default connect;
