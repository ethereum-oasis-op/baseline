"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generate = generate;
exports.getRandomInt = getRandomInt;
exports.default = void 0;

var _times = _interopRequireDefault(require("lodash/times"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Takes a fixture generator method and a number and returns that fixture
 * `n` times.
 *
 * @param {function} generator - Method that generates a JSON object fixture.
 * @param {number} n - Number of fixtures you want generated.
 * @returns {array|object} - Array of fixture objects or single object if n = 1.
 */
function generate(generator, n = 1) {
  return n === 1 ? generator() : (0, _times.default)(n, generator);
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

var _default = generate;
exports.default = _default;