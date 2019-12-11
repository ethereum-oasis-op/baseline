import express from 'express';
import zokrates from '@eyblockchain/zokrates.js';

const router = express.Router();

router.post('/', async (req, res, next) => {
  const { name } = req.body;
  try {
    await zokrates.compile(`./code/${name}.code`, `./output`, `${name}_out`);
    await zokrates.setup(
      `./output/${name}_out`,
      './output',
      `${process.env.PROVING_SCHEME}`,
      `${name}_vk`,
      `${name}_pk`,
    );
    await zokrates.exportVerifier(
      `./output/${name}_vk.key`,
      `./output`,
      `Verifier_${name}.sol`,
      `${process.env.PROVING_SCHEME}`,
    );
    return res.send('Generated Keys');
  } catch (err) {
    return next(err);
  }
});

export default router;
