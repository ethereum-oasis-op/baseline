require('../logger');
const { receiveMessageQueue } = require('../queues/receiveMessage/');

// Useful constants
const DEFAULT_TOPIC = process.env.WHISPER_TOPIC || '0x11223344';
const POW_TIME = process.env.WHISPER_POW_TIME || 100;
const TTL = process.env.WHISPER_TTL || 20;
const POW_TARGET = process.env.WHISPER_POW_TARGET || 2;

/**
 * Checks whether a given string can be converted to a proper JSON object.
 * Edge cases: inputs of "true" or "null" return false
 * @param {String} str 
 */
function hasJsonStructure(str) {
  if (typeof str !== 'string') return false;
  try {
    const result = JSON.parse(str);
    const type = Object.prototype.toString.call(result);
    const isJSON = type === '[object Object]' || type === '[object Array]';
    return [isJSON, result];
  } catch (err) {
    return [false, {}];
  }
}

// ***** Usage *****
// const [err, result] = safeJsonParse('[Invalid JSON}');
// if (err) console.log('Failed to parse JSON: ' + err.message);
// else console.log(result);
function safeJsonParse(str) {
  try {
    return [null, JSON.parse(str)];
  } catch (err) {
    return [err];
  }
}

module.exports = {
  hasJsonStructure,
  safeJsonParse,
  DEFAULT_TOPIC,
  POW_TIME,
  TTL,
  POW_TARGET,
};
