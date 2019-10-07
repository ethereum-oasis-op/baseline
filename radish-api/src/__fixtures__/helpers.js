import times from 'lodash/times';

/**
 * Takes a fixture generator method and a number and returns that fixture
 * `n` times.
 *
 * @param {function} generator - Method that generates a JSON object fixture.
 * @param {number} n - Number of fixtures you want generated.
 * @returns {array|object} - Array of fixture objects or single object if n = 1.
 */
export function generate(generator, n = 1) {
  return n === 1 ? generator() : times(n, generator);
}

export function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default generate;
