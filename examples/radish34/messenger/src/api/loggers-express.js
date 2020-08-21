const winston = require('winston');
const expressWinston = require('express-winston');
const Config = require('../../config');

// Express request (and below error) logging using Express-Winston module
const RequestLogger = () => (expressWinston.logger({
  transports: [
    new winston.transports.Console(),
  ],
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    winston.format.align(),
    winston.format.splat(),
    winston.format.printf((info) => {
      const {
        timestamp, level, message, ...args
      } = info;

      const ts = timestamp.slice(0, 19).replace('T', ' ');
      return `${ts} [${level}]: ${message} ${args.meta.res.statusCode} ${args.meta.responseTime}ms ${Object.keys(args).length ? JSON.stringify(args) : ''}`;
    }),
  ),
  meta: true,
}));

const RequestErrorLogger = () => (expressWinston.errorLogger({
  transports: [
    new winston.transports.Console(),
  ],
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.simple(),
  ),
}));

module.exports = {
  RequestLogger,
  RequestErrorLogger,
};
