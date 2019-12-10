import express from 'express';
import zokrates from '@eyblockchain/zokrates.js';

const router = express.Router();

router.post('/', async (req, res, next) => {
  const { name } = req.body;
  try {
    await zokrates.exportVerifier(
      `./output/${name}_vk.key`,
      `./output`,
      `Verifier_${name}.sol`,
      `${process.env.PROVING_SCHEME}`,
    );
    return res.send('ExportedVerifier');
  } catch (err) {
    return next(err);
  }
});

export default router;
