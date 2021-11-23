const chalk = require('chalk');
const path = require('path');

module.exports = {
  // Logging levels
  levels: {
    error: 0,
    warning: 1,
    deprecated: 2,
    http: 3,
    info: 4,
    verbose: 5,
    debug: 6,
  },
  // Colors for logging levels
  error: chalk.bold.red,
  warning: chalk.bold.blackBright,
  deprecated: chalk.bold.keyword('orange'),
  http: chalk.bold.blue,
  info: chalk.bold.whiteBright,
  verbose: chalk.bold.yellow,
  debug: chalk.bold.green,
  // Colors for http status
  information: chalk.whiteBright,
  success: chalk.green,
  redirection: chalk.cyan,
  client: chalk.yellow,
  server: chalk.red,
  // Root path
  rootPath: path.join(__dirname, '../../'),
};
