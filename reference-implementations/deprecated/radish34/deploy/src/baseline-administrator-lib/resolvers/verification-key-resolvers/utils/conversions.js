const crypto = require('crypto');

/** Helper function for the converting any base to any base
 */
const parseToDigitsArray = (str, base) => {
  const digits = str.split('');
  const ary = [];
  for (let i = digits.length - 1; i >= 0; i -= 1) {
    const n = parseInt(digits[i], base);
    if (Number.isNaN(n)) return null;
    ary.push(n);
  }
  return ary;
};

/** Helper function for the converting any base to any base
 */
const add = (x, y, base) => {
  const z = [];
  const n = Math.max(x.length, y.length);
  let carry = 0;
  let i = 0;
  while (i < n || carry) {
    const xi = i < x.length ? x[i] : 0;
    const yi = i < y.length ? y[i] : 0;
    const zi = carry + xi + yi;
    z.push(zi % base);
    carry = Math.floor(zi / base);
    i += 1;
  }
  return z;
};

/** Helper function for the converting any base to any base
 Returns a*x, where x is an array of decimal digits and a is an ordinary
 JavaScript number. base is the number base of the array x.
 */
const multiplyByNumber = (num, x, base) => {
  if (num < 0) return null;
  if (num === 0) return [];

  let result = [];
  let power = x;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    // eslint-disable-next-line no-bitwise
    if (num & 1) {
      result = add(result, power, base);
    }
    num >>= 1; // eslint-disable-line
    if (num === 0) break;
    power = add(power, power, base);
  }
  return result;
};

/** Helper function for the converting any base to any base
 */
const convertBase = (str, fromBase, toBase) => {
  const digits = parseToDigitsArray(str, fromBase);
  if (digits === null) return null;

  let outArray = [];
  let power = [1];
  for (let i = 0; i < digits.length; i += 1) {
    // invariant: at this point, fromBase^i = power
    if (digits[i]) {
      outArray = add(outArray, multiplyByNumber(digits[i], power, toBase), toBase);
    }
    power = multiplyByNumber(fromBase, power, toBase);
  }

  let out = '';
  for (let i = outArray.length - 1; i >= 0; i -= 1) {
    out += outArray[i].toString(toBase);
  }
  // if the original input was equivalent to zero, then 'out' will still be empty ''. Let's check for zero.
  if (out === '') {
    let sum = 0;
    for (let i = 0; i < digits.length; i += 1) {
      sum += digits[i];
    }
    if (sum === 0) out = '0';
  }

  return out;
};

/**
utility function to check that a string has a leading 0x (which the Solidity
compiler uses to check for a hex string).  It adds it if it's not present. If
it is present then it returns the string unaltered
*/
const ensure0x = (hex = '') => {
  const hexString = hex.toString();
  if (typeof hexString === 'string' && hexString.indexOf('0x') !== 0) {
    return `0x${hexString}`;
  }
  return hexString;
};

/**
function to generate a promise that resolves to a string of hex
@param {int} bytes - the number of bytes of hex that should be returned
*/
const rndHex = bytes => {
  const buf = crypto.randomBytes(bytes);
  return `0x${buf.toString('hex')}`;
};

// Converts hex strings to decimal values
const hexToDec = hexStr => {
  if (hexStr.substring(0, 2) === '0x') {
    return convertBase(hexStr.substring(2).toLowerCase(), 16, 10);
  }
  return convertBase(hexStr.toLowerCase(), 16, 10);
};

// UTILITY FUNCTIONS:

/* flattenDeep converts a nested array into a flattened array. We use this to pass our proofs and vks into the verifier contract.
Example:
A vk of the form:
[
  [
    [ '1','2' ],
    [ '3','4' ]
  ],
    [ '5','6' ],
    [
      [ '7','8' ], [ '9','10' ]
    ],
  [
    [ '11','12' ],
    [ '13','14' ]
  ],
    [ '15','16' ],
    [
      [ '17','18' ], [ '19','20' ]
    ],
  [
    [ '21','22' ],
    [ '23','24' ]
  ],
  [
    [ '25','26' ],
    [ '27','28' ],
    [ '29','30' ],
    [ '31','32' ]
  ]
]

is converted to:
['1','2','3','4','5','6',...]
 */
const flattenDeep = arr => {
  return arr.reduce(
    (acc, val) => (Array.isArray(val) ? acc.concat(flattenDeep(val)) : acc.concat(val)),
    [],
  );
};

module.exports = {
  ensure0x,
  hexToDec,
  rndHex,
  flattenDeep,
};
