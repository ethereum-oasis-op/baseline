import mongoose from 'mongoose';

const { connection } = mongoose;
const mongoURL = `${process.env.MONGO_URL}/${process.env.MONGO_DB_NAME}`;

const onConnected = () => {
  console.log(`DB Connected to ${mongoURL}`);
};

const onError = err => {
  console.log(`DB Error:`, err);
};

const onDisconnected = () => {
  console.log(`DB Disconnected from ${mongoURL}`);
};

const onExit = () => {
  connection.close(() => {
    console.log(`DB Disconnected due to process exit`);
    process.exit();
  });
};

const connect = async () => {
  console.log('DB Connecting ...');

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
