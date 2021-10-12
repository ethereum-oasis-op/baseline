const winston = require('winston');
const Config = require('../config');

// General purpose logging using Winston's default logger
// Adds in custom formatting and configuration
const logger = winston.configure({
  transports: [
    new winston.transports.Console(),
  ],
  level: Config.logLevel,
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    winston.format.errors({ stack: true }),
    winston.format.simple(),
    winston.format.align(),
    winston.format.splat(),
    winston.format.printf((info) => {
      const {
        timestamp, level, message, ...args
      } = info;

      const ts = timestamp.slice(0, 19).replace('T', ' ');
      return `${ts} [${level}]: ${message} ${Object.keys(args).length ? JSON.stringify(args) : ''}`;
    }),
  ),
  colorize: true,
});

module.exports = logger;
