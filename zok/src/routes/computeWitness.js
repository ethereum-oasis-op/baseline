import express from 'express';
import zokrates from '@eyblockchain/zokrates.js';

const router = express.Router();

router.post('/', async (req, res, next) => {
  const { name } = req.body;
  const vars = req.body.witness;
  try {
    await zokrates.computeWitness(`./output/${name}_out`, './output', `${name}_witness`, vars);
    return res.send('ComputeWitness');
  } catch (err) {
    return next(err);
  }
});

export default router;
