import express from 'express';
import zokrates from '@eyblockchain/zokrates.js';

const router = express.Router();

router.post('/', async (req, res, next) => {
  const { name } = req.body;
  try {
    await zokrates.setup(
      `./output/${name}_out`,
      './output',
      `${process.env.PROVING_SCHEME}`,
      `${name}_vk`,
      `${name}_pk`,
    );
    return res.send('Setup');
  } catch (err) {
    return next(err);
  }
});

export default router;
