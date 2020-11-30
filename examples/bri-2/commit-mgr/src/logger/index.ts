import winston from "winston";
import expressWinston from "express-winston";
import path from "path";
import { levels, rootPath } from "./static";
import {
  defaultConsoleFormat,
  reqHttpConsoleFormat,
  defaultFileFormat,
  reqHttpFileFormat,
  filterWithout,
} from "./format";

const logsPath = path.join(rootPath, './logs');

// Logging level for environment level
// TODO: Adjust anyhow
const env = process.env.NODE_ENV || 'development';
const envLevel = env === 'production' ? 'info' : 'debug';

// Date for log filename
const getDateString = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const utcTimestamp = () => {
  // 'YYYY-MM-DD HH:mm:ss',
  const epoch = new Date().getTime();
  const date = new Date(epoch);
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  const hour = `${date.getUTCHours()}`.padStart(2, '0');
  const minute = `${date.getUTCMinutes()}`.padStart(2, '0');
  const second = `${date.getUTCSeconds()}`.padStart(2, '0');
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}

// Transports
const transports = {
  defaultConsole: new winston.transports.Console({
    level: envLevel,
    format: winston.format.combine(
      winston.format.timestamp({
        format: utcTimestamp
      }),
      winston.format.errors({ stack: true }),
      winston.format.splat(),
      winston.format.simple(),
      filterWithout('http'),
      defaultConsoleFormat
    ),
  }),
  reqHttpConsole: new winston.transports.Console({
    format: winston.format.combine(
      winston.format.timestamp({
        format: utcTimestamp
      }),
      winston.format.errors({ stack: true }),
      winston.format.splat(),
      winston.format.simple(),
      reqHttpConsoleFormat
    ),
  }),
  defaultFile: new winston.transports.File({
    filename: logsPath + `/${getDateString()}_debug.log`,
    level: envLevel,
    format: winston.format.combine(
      winston.format.timestamp({
        format: utcTimestamp
      }),
      winston.format.errors({ stack: true }),
      winston.format.splat(),
      winston.format.simple(),
      filterWithout('http'),
      defaultFileFormat
    ),
  }),
  reqHttpFile: new winston.transports.File({
    filename: logsPath + `/${getDateString()}_debug.log`,
    format: winston.format.combine(
      winston.format.timestamp({
        format: utcTimestamp,
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
    transports.defaultFile,
  ],
  levels,
  // Do not exit on handled exceptions
  exitOnError: false,
});

export const reqLogger = (service) =>
  expressWinston.logger({
    transports: [
      transports.reqHttpConsole,
      transports.reqHttpFile
    ],
    meta: true,
    statusLevels: false,
    colorize: false,
    // Pass service string via msg
    msg: service,
    bodyWhitelist: ['method'],
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
