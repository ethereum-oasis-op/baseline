import axios from 'axios';
import { logger } from '../logger';

export const signHash = async (eddsaKey, payload) => {
  logger.debug(`Received request to sign ${payload} using eddsa key ${eddsaKey}`);
  let response;
  try {
    response = await axios.post(`${process.env.KEY_MGR_URL}/zk-snarks/accounts/${eddsaKey}/sign`, {
      data: payload
    });
  } catch (err) {
    logger.error(`Axios error when calling key-manager: ${err.message}`);
    return { error: err };
  }
  logger.debug(`signHash result: ${response.data}`);
  return { result: response.data };
};
