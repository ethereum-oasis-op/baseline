const winston = require('winston');
const os = require('os');
const {
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
} = require('./static');

const LEVEL = Symbol.for('level');

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

module.exports = {
  // Formats
  defaultConsoleFormat: winston.format.printf(
    ({ timestamp, level, service, message, ...args }) => {
      const timestampFormated = timestamp.slice(0, 19).replace('T', ' ');

      return `[${timestampFormated}] [${levelFormat(
        level
      )}] [${service}] [${os.hostname()}]: ${message} ${
        Object.keys(args).length ? JSON.stringify(args) : ''
      }`;
    }
  ),
  simpleHttpConsoleFormat: winston.format.printf(
    ({
      timestamp,
      level,
      service,
      message,
      statusCode,
      responseTime,
      responseData,
      requestMethod,
      requestUrl,
      requestQuery,
      requestBody,
      ...args
    }) => {
      const timestampFormated = timestamp.slice(0, 19).replace('T', ' ');

      return `[${timestampFormated}] [${levelFormat(level)}] [${service}] [${os.hostname()}]: ${
        statusCode !== undefined ? statusFormat(statusCode) : ''
      } ${responseTime !== undefined ? responseTime : '/'}ms ${
        requestMethod !== undefined ? requestMethod : ''
      } ${requestUrl !== undefined ? requestUrl : ''}${
        requestQuery !== undefined ? requestQuery : ''
      } ${message} ${
        requestBody !== undefined ? '\n' + JSON.stringify(requestBody) : ''
      } ${
        responseData !== undefined ? '\n' + JSON.stringify(responseData) : ''
      } ${Object.keys(args).length ? '\n' + JSON.stringify(args) : ''}`;
    }
  ),
  reqHttpConsoleFormat: winston.format.printf(
    ({ timestamp, level, message, meta }) => {
      const timestampFormated = timestamp.slice(0, 19).replace('T', ' ');
      level = 'http';
      const service = message;

      return `[${timestampFormated}] [${levelFormat(
        level
      )}] [${service}] [${os.hostname()}]: ${statusFormat(meta.res.statusCode)} ${
        meta.responseTime
      }ms ${meta.req.method} ${meta.req.originalUrl}`;
    }
  ),
  defaultFileFormat: winston.format.printf(
    ({ timestamp, level, service, message, ...args }) => {
      const timestampFormated = timestamp.slice(0, 19).replace('T', ' ');

      return `[${timestampFormated}] [${level.toUpperCase()}] [${service}] [${os.hostname()}]: ${message} ${
        Object.keys(args).length ? JSON.stringify(args) : ''
      }`;
    }
  ),
  simpleHttpFileFormat: winston.format.printf(
    ({
      timestamp,
      level,
      service,
      message,
      statusCode,
      responseTime,
      responseData,
      requestMethod,
      requestUrl,
      requestQuery,
      requestBody,
      ...args
    }) => {
      const timestampFormated = timestamp.slice(0, 19).replace('T', ' ');

      return `[${timestampFormated}] [${level.toUpperCase()}] [${service}] [${os.hostname()}]: ${
        statusCode !== undefined ? statusCode : ''
      } ${responseTime !== undefined ? responseTime : '/'}ms ${
        requestMethod !== undefined ? requestMethod : ''
      } ${requestUrl !== undefined ? requestUrl : ''}${
        requestQuery !== undefined ? requestQuery : ''
      } ${message} ${
        requestBody !== undefined ? '\n' + JSON.stringify(requestBody) : ''
      } ${
        responseData !== undefined ? '\n' + JSON.stringify(responseData) : ''
      } ${Object.keys(args).length ? '\n' + JSON.stringify(args) : ''}`;
    }
  ),
  reqHttpFileFormat: winston.format.printf(
    ({ timestamp, level, message, meta }) => {
      const timestampFormated = timestamp.slice(0, 19).replace('T', ' ');
      level = 'http';
      const service = message;

      return `[${timestampFormated}] [${level.toUpperCase()}] [${service}] [${os.hostname()}]: ${
        meta.res.statusCode
      } ${meta.responseTime}ms ${meta.req.method} ${
        meta.req.originalUrl
      } ${JSON.stringify(meta)}`;
    }
  ),
  // Filter
  filterOnly: (level) => {
    return winston.format((info) => {
      if (info[LEVEL] === level) {
        return info;
      }
    })();
  },
  filterWithout: (level) => {
    return winston.format((info) => {
      if (info[LEVEL] !== level) {
        return info;
      }
    })();
  },
};
