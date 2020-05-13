import express from 'express';
import { getVerificationKeyByID } from '../utils/fileToDB';
import { logger } from 'radish34-logger';

const router = express.Router();

/**
 * @param {string} id is the name of the circuit, e.g. 'createMSA'

*/
router.get('/', async (req, res, next) => {
  try {
    const { id } = req.body;
    const vk = await getVerificationKeyByID(id);

    logger.info(`Returning vk.`, { service: 'ZKP'});
    logger.verbose(vk, { service: 'ZKP', vk: vk });

    const response = { vk };
    return res.send(response);
  } catch (err) {
    logger.error(err, { service: 'ZKP' });
    return next(err);
  }
});

export default router;
