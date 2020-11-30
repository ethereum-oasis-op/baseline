import chalk from "chalk";
import path from "path";

// Logging levels
export const levels = {
  error: 0,
  warning: 1,
  deprecated: 2,
  http: 3,
  info: 4,
  verbose: 5,
  debug: 6,
};

// Colors for logging levels
export const error = chalk.bold.red;
export const warning = chalk.bold.blackBright;
export const deprecated = chalk.bold.keyword('orange');
export const http = chalk.bold.blue;
export const info = chalk.bold.whiteBright;
export const verbose = chalk.bold.yellow;
export const debug = chalk.bold.green;

// Colors for http status
export const information = chalk.whiteBright;
export const success = chalk.green;
export const redirection = chalk.cyan;
export const client = chalk.yellow;
export const server = chalk.red;

// Root path
export const rootPath = path.join(__dirname, '../../');
