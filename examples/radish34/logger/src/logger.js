const winston = require('winston');
const expressWinston = require('express-winston');
const path = require('path');
const { levels, rootPath } = require('./static');
const {
  defaultConsoleFormat,
  simpleHttpConsoleFormat,
  reqHttpConsoleFormat,
  defaultFileFormat,
  simpleHttpFileFormat,
  reqHttpFileFormat,
  filterOnly,
  filterWithout,
} = require('./format');

const logsPath = path.join(rootPath, './app/logs');

// Logging level for environment level
// TODO: Adjust anyhow
const env = process.env.NODE_ENV || 'development';
const __level__ = env === 'production' ? 'info' : 'debug';

// Date for log filename
const getDateString = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Transports
const transports = {
  defaultConsole: new winston.transports.Console({
    level: __level__,
    format: winston.format.combine(
      winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
      }),
      winston.format.errors({ stack: true }),
      winston.format.splat(),
      winston.format.simple(),
      filterWithout('http'),
      defaultConsoleFormat
    ),
  }),
  simpleHttpConsole: new winston.transports.Console({
    level: 'http',
    format: winston.format.combine(
      winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
      }),
      winston.format.errors({ stack: true }),
      winston.format.splat(),
      winston.format.simple(),
      filterOnly('http'),
      simpleHttpConsoleFormat
    ),
  }),
  reqHttpConsole: new winston.transports.Console({
    format: winston.format.combine(
      winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
      }),
      winston.format.errors({ stack: true }),
      winston.format.splat(),
      winston.format.simple(),
      reqHttpConsoleFormat
    ),
  }),
  defaultFile: new winston.transports.File({
    filename: logsPath + `/${getDateString()}_debug.log`,
    level: __level__,
    format: winston.format.combine(
      winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
      }),
      winston.format.errors({ stack: true }),
      winston.format.splat(),
      winston.format.simple(),
      filterWithout('http'),
      defaultFileFormat
    ),
  }),
  simpleHttpFile: new winston.transports.File({
    filename: logsPath + `/${getDateString()}_debug.log`,
    level: 'http',
    format: winston.format.combine(
      winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
      }),
      winston.format.errors({ stack: true }),
      winston.format.splat(),
      winston.format.simple(),
      filterOnly('http'),
      simpleHttpFileFormat
    ),
  }),
  reqHttpFile: new winston.transports.File({
    filename: logsPath + `/${getDateString()}_debug.log`,
    format: winston.format.combine(
      winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
      }),
      winston.format.errors({ stack: true }),
      winston.format.splat(),
      winston.format.simple(),
      reqHttpFileFormat
    ),
  }),
};

// Logger
export const logger = winston.createLogger({
  transports: [
    transports.defaultConsole,
    transports.simpleHttpConsole,
    transports.defaultFile,
    transports.simpleHttpFile,
  ],
  levels: levels,
  // Do not exit on handled exceptions
  exitOnError: false,
});

export const reqLogger = (service) =>
  expressWinston.logger({
    transports: [transports.reqHttpConsole, transports.reqHttpFile],
    meta: true,
    statusLevels: false,
    colorize: false,
    // Pass service string via msg
    msg: service,
  });

export const reqErrorLogger = (service) =>
  expressWinston.errorLogger({
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({ filename: logsPath + `/${getDateString()}_debug.log` }),
    ],
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.json()
    ),
    // Pass service string via msg
    msg: service,
  });

export default { logger, reqLogger, reqErrorLogger };
module.exports = { logger, reqLogger, reqErrorLogger };
