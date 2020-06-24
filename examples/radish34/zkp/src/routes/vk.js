import express from 'express';
import { getVerificationKeyByID } from '../utils/fileToDB';

const router = express.Router();

/**
 * @param {string} id is the name of the circuit, e.g. 'createMSA'
 */
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(`\nReceived request ${id} to /vk`);
    const vk = await getVerificationKeyByID(id);
    console.log('\nReturning vk:');
    console.log(vk);
    const response = { vk };
    return res.send(response);
  } catch (err) {
    return next(err);
  }
});

export default router;
