
const defaults = require('./default.js');

const config = require(`./${process.env.NODE_ENV || 'development'}.js`);

// Copy 'defaults' and 'config' objects into empty object, then export
module.exports = {

  ...JSON.parse(JSON.stringify(defaults)),
  ...JSON.parse(JSON.stringify(config)),
};
