import express from 'express';
import zokrates from '@eyblockchain/zokrates.js';

const router = express.Router();

router.post('/', async (req, res, next) => {
  const { name } = req.body;
  const opts = {};
  opts.createFile = true;
  opts.directory = './output';
  opts.fileName = `${name}_proof.json`;
  try {
    await zokrates.generateProof(
      `./output/${name}_pk.key`,
      `./output/${name}_out`,
      `./output/${name}_witness`,
      `${process.env.PROVING_SCHEME}`,
      opts,
    );
    return res.send('GenerateProof');
  } catch (err) {
    return next(err);
  }
});

export default router;
