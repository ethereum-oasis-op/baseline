import express from 'express';
import { getVerificationKeyByID } from '../utils/fileToDB';
import { logger } from 'radish34-logger';

const router = express.Router();

/**
 * @param {string} id is the name of the circuit, e.g. 'createMSA'
 */
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const vk = await getVerificationKeyByID(id);

    logger.info('Returning vk.\n%o', vk, { service: 'ZKP'});

    const response = { vk };
    return res.send(response);
  } catch (err) {
    logger.error('\n%o', err, { service: 'ZKP' });
    return next(err);
  }
});

export default router;
