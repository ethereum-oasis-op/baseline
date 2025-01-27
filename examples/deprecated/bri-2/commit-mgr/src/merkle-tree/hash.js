import crypto from "crypto";
import { Buffer } from "safe-buffer";
import { logger } from "../logger";
import { config } from "./config";

/**
 * utility function to remove a leading 0x on a string representing a hex number.
 * If no 0x is present then it returns the string un-altered.
 */
function strip0x(hex) {
  if (typeof hex === 'undefined') return '';
  if (typeof hex === 'string' && hex.indexOf('0x') === 0) {
    return hex.slice(2).toString();
  }
  return hex.toString();
}

/**
 * Utility function to concatenate two hex strings and return as buffer
 * Looks like the inputs are somehow being changed to decimal!
 */
function concatenate(a, b) {
  const length = a.length + b.length;
  const buffer = Buffer.allocUnsafe(length); // creates a buffer object of length 'length'
  for (let i = 0; i < a.length; i += 1) {
    buffer[i] = a[i];
  }
  for (let j = 0; j < b.length; j += 1) {
    buffer[a.length + j] = b[j];
  }
  return buffer;
}

function shaHash(...items) {
  const concatValue = items
    .map(item => Buffer.from(strip0x(item), 'hex'))
    .reduce((acc, item) => concatenate(acc, item));

  const h = `0x${crypto
    .createHash('sha256')
    .update(concatValue, 'hex')
    .digest('hex')}`;
  return h;
}

/**
 * Utility function to:
 * - convert each item in items to a 'buffer' of bytes (2 hex values), convert those bytes into decimal representation
 * - 'concatenate' each decimally-represented byte together into 'concatenated bytes'
 * - hash the 'buffer' of 'concatenated bytes' (sha256) (sha256 returns a hex output)
 * - truncate the result to the right-most 64 bits
 * Return: sha256 hash
 */
function concatenateThenHash(...items) {
  let inputs = items;
  for (let index = 0; index < items.length; index++) {
    inputs[index] = items[index].slice(-config.NODE_HASHLENGTH * 2)
  };
  logger.debug(`concatenateThenHash inputs: %o`, inputs);
  const h = shaHash(...inputs);
  logger.debug(`Hash result: ${h}`);
  return h;
}

// Used in utils.js
export {
  concatenateThenHash,
};
