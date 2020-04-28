const request = require('request');
const {
  poll
} = require('./../utils/poll');

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
    console.log(
      `Got a polling error "${err}", but that might be because the external server missed our call - we'll poll again...`,
    );
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
    throw new Error(`Could not get the vk for ${circuitName}`);
  }
}

module.exports = {
  pollVk,
};