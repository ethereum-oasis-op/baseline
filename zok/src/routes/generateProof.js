import express from 'express';
import zokrates from '@eyblockchain/zokrates.js';

const router = express.Router();

router.post('/', async (req, res, next) => {
  const { name, witness, outputDirectoryPath, proofFileName } = req.body;
  const opts = {};
  opts.createFile = true;
  opts.directory = './output' || outputDirectoryPath;
  opts.fileName = `${name}_proof.json` || proofFileName;
  try {
    await zokrates.computeWitness(`./output/${name}_out`, './output', `${name}_witness`, witness);
    await zokrates.generateProof(
      `./output/${name}_pk.key`,
      `./output/${name}_out`,
      `./output/${name}_witness`,
      `${process.env.PROVING_SCHEME}`,
      opts,
    );
    return res.send('Generated Proof');
  } catch (err) {
    return next(err);
  }
});

export default router;
