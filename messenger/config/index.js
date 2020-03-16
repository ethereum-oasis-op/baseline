
const defaults = require('./default.js');

const nodeEnv = process.env.NODE_ENV || 'development';
const config = require(`./${nodeEnv}.js`);

// Copy 'defaults' and 'config' objects into empty object, then export
module.exports = {

  ...JSON.parse(JSON.stringify(defaults)),
  ...JSON.parse(JSON.stringify(config)),
};
