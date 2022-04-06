const { jest: jestConfig } = require('cod-scripts/config');

module.exports = Object.assign(jestConfig, {
  rootDir: './dist',
  coverageThreshold: null,
});
