const request = require('request');
const {
  poll
} = require('./../utils/poll');
const { logger } = require('radish34-logger');

// TODO: create config for this value?
const POLLING_FREQUENCY = 6000; // milliseconds

/**
GET the verification key for a particular circuit
@param {string} zkpUrl Url to the zkp service
@param {string} id is the name of the circuit, e.g. 'createMSA'
*/
async function getVk(zkpUrl, id) {
  return new Promise((resolve, reject) => {
    const options = {
      url: `${zkpUrl}/vk/${encodeURIComponent(id)}`,
      method: 'GET',
      json: true,
    };
    request(options, (err, res, body) => {
      if (err) reject(err);
      else resolve(body);
    });
  });
}

/**
GET the verification key for a particular circuit.
@returns {false | object} Polling functions MUST return FALSE if the poll is unsuccessful. Otherwise we return the response from the external microservice
*/
const getVkPollingFunction = async args => {
  try {
    const {
      id,
      zkpUrl
    } = args;

    const response = await getVk(zkpUrl, id);

    return response;
  } catch (err) {
    logger.error('Polling error, but that might be because the external server missed our call. We will poll again...\n%o', err, { service: 'DEPLOY' });
    return false;
  }
};

async function pollVk(zkpUrl, circuitName) {
  try {
    const {
      vk
    } = await poll(getVkPollingFunction, POLLING_FREQUENCY, {
      zkpUrl,
      id: circuitName,
    });
    return vk;
  } catch (err) {
    logger.error(`Could not get the vk for ${circuitName}.\n%o`, err, { service: 'DEPLOY' });
    throw new Error(`Could not get the vk for ${circuitName}.`);
  }
}

module.exports = {
  pollVk,
};
