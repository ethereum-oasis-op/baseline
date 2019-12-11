import express from 'express';
import zokrates from '@eyblockchain/zokrates.js';

const router = express.Router();

router.post('/', async (req, res, next) => {
  const { name, witness } = req.body;
  try {
    await zokrates.computeWitness(`./output/${name}_out`, './output', `${name}_witness`, witness);
    return res.send('ComputeWitness');
  } catch (err) {
    return next(err);
  }
});

export default router;
