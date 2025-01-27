import winston from "winston";
import os from "os";
import {
  error,
  warning,
  deprecated,
  http,
  info,
  verbose,
  debug,
  information,
  success,
  redirection,
  client,
  server,
} from "./static";

const levelFormat = (level) => {
  switch (level) {
    case 'error':
      return error(level.toUpperCase());
    case 'warning':
      return warning(level.toUpperCase());
    case 'deprecated':
      return deprecated(level.toUpperCase());
    case 'http':
      return http(level.toUpperCase());
    case 'info':
      return info(level.toUpperCase());
    case 'verbose':
      return verbose(level.toUpperCase());
    case 'debug':
      return debug(level.toUpperCase());
    default:
      return level;
  }
};

const statusFormat = (status) => {
  if (100 <= status && status <= 199) {
    return information(status.toString());
  } else if (200 <= status && status <= 299) {
    return success(status.toString());
  } else if (300 <= status && status <= 399) {
    return redirection(status.toString());
  } else if (400 <= status && status <= 499) {
    return client(status.toString());
  } else if (500 <= status && status <= 599) {
    return server(status.toString());
  } else {
    return status.toString();
  }
};

// Formats
export const defaultConsoleFormat = winston.format.printf(
  ({ timestamp, level, service, message, ...args }) => {
    const timestampFormated = timestamp.slice(0, 19).replace('T', ' ');

    return `[${timestampFormated}] [${levelFormat(level)}]: ` +
      `${message} ${Object.keys(args).length ? JSON.stringify(args) : ''}`;
  }
);

// TODO: handle batched requests
export const reqHttpConsoleFormat = winston.format.printf(
  ({ timestamp, level, message, meta }) => {
    const timestampFormated = timestamp.slice(0, 19).replace('T', ' ');
    level = 'http';
    const rpcMethod = meta.req.body ? meta.req.body.method : '';

    return `[${timestampFormated}] [${levelFormat(level)}]: ${meta.req.method} ` +
      `${meta.req.originalUrl} ${statusFormat(meta.res.statusCode)} ${meta.responseTime}ms ` +
      `[${rpcMethod}]`;
  }
);

export const defaultFileFormat = winston.format.printf(
  ({ timestamp, level, message, ...args }) => {
    const timestampFormated = timestamp.slice(0, 19).replace('T', ' ');

    return `[${timestampFormated}] [${level.toUpperCase()}] [COMMIT-MGR] [${os.hostname()}]: ${message} ${Object.keys(args).length ? JSON.stringify(args) : ''
      }`;
  }
);

// TODO: handle batched requests
export const reqHttpFileFormat = winston.format.printf(
  ({ timestamp, level, message, meta }) => {
    const timestampFormated = timestamp.slice(0, 19).replace('T', ' ');
    level = 'http';
    const rpcMethod = meta.req.body ? meta.req.body.method : '';
    const service = message;

    return `[${timestampFormated}] [${level.toUpperCase()}] [${service}] [${os.hostname()}]: ${meta.req.method} ` +
      `${meta.req.originalUrl} ${meta.res.statusCode} ${meta.responseTime}ms ` +
      `[${rpcMethod}] ${JSON.stringify(meta)}`;
  }
);

// Filter
export const filterOnly = (level) => {
  return winston.format((config) => {
    if (config.level === level) {
      return config;
    }
  })();
};

export const filterWithout = (level) => {
  return winston.format((config) => {
    if (config.level !== level) {
      return config;
    }
  })();
};
