const request = require('request');
const { poll } = require('../utils/poll');

const url = process.env.ZOK_URL;

// TODO: create config for this value?
const POLLING_FREQUENCY = 6000; // milliseconds

/**
GET the verification key for a particular circuit
@param {string} id is the name of the circuit, e.g. 'createMSA'
*/
async function getVk(id) {
  console.log(`\nCalling /vk(${id})`);
  return new Promise((resolve, reject) => {
    const options = {
      url: `${url}/vk`,
      method: 'GET',
      json: true,
      // headers: ,
      body: { id },
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
    const { id } = args;

    const response = await getVk(id);

    return response;
  } catch (err) {
    console.log(
      `Got a polling error "${err}", but that might be because the external server missed our call - we'll poll again...`,
    );
    return false;
  }
};

/**
GET the verification key for a particular circuit
@param {Array(string)} circuitNames - An array of circuit names e.g. for 'createMSA.zok', the circuitName is 'createMSA'
*/
async function getVks(circuitNames) {
  const vks = await Promise.all(
    circuitNames.map(async circuitName => {
      try {
        const { vk } = await poll(getVkPollingFunction, POLLING_FREQUENCY, {
          id: circuitName,
        });
        // console.log(`\nResponse from zok microservice for ${circuitName}:`);
        // console.log(vk);
        return vk;
      } catch (err) {
        throw new Error(`Could not get the vk for ${circuitName}`);
      }
    }),
  );

  return vks;
}

module.exports = {
  getVks,
};
