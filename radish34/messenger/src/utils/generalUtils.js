const axios = require('axios');
const logger = require('winston');
require('../logger');
const { receiveMessageQueue } = require('../queues/receiveMessage/');

const {
  DEFAULT_TOPIC,
  POW_TIME,
  TTL,
  POW_TARGET,
} = require('../clients/whisper/whisperUtils.js');

const radishApiUrl = process.env.RADISH_API_URL ? `${process.env.RADISH_API_URL}/api/v1` : 'http://localhost:8101/api/v1';

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


/**
 * Function that forwards the message
 * @param {Object} messageObj 
 */
async function forwardMessage(messageObj) {
  logger.info(`Forwarding message to api service: POST ${radishApiUrl}/documents`);
  try {
    const response = await axios.post(`${radishApiUrl}/documents`, messageObj);
    logger.info(`SUCCESS: POST ${radishApiUrl}/documents`);
    logger.info(`${response.status} -`, response.data);
  } catch (error) {
    logger.error(`ERROR: POST ${radishApiUrl}/documents`);
    if (error.response) {
      logger.error(`${error.response.status} -`, error.response.data);
    }
  }
}

module.exports = {
  hasJsonStructure,
  safeJsonParse,
  forwardMessage,
  DEFAULT_TOPIC,
  POW_TIME,
  TTL,
  POW_TARGET,
};
