import request from 'request';
import { logger } from 'radish34-logger';

const url = process.env.ZKP_URL;

/**
POST inputs to a circuit (and receive a proof in return)
@param {string} circuitName - The name of the circuit. E.g. for 'createMSA.zok', the circuitName is 'createMSA'
@param {Array(field)} inputs is the set of 'field' values (both public & private) which are to be passed to the main() function of a zokrates `.zok` file.
*/
export const generateProof = async (filename, inputs) => {
  logger.info(`Calling /generateProof with ${filename} and\n%o`, inputs, { service: 'API'});
  return new Promise((resolve, reject) => {
    const options = {
      url: `${url}/generate-proof`,
      method: 'POST',
      json: true,
      // headers:,
      body: { filename, inputs },
      timeout: 120000,
    };
    request(options, (err, res, body) => {
      if (err) reject(err);
      else {
        logger.http('Success', { service: 'API', statusCode: res.status, responseData: body, requestMethod: 'POST', requestUrl: `${url}/generate-proof`, requestBody: { filename, inputs }});
        resolve(body);
      }
    });
  });
};

export { generateProof as default };
