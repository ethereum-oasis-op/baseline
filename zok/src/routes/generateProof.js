import express from 'express';
import zokrates from '@eyblockchain/zokrates.js';
import { saveProofToDB } from '../utils/fileToDB';

const router = express.Router();

router.post('/', async (req, res, next) => {
  const { docId, name, witness, outputDirectoryPath, proofFileName } = req.body;
  const opts = {};
  opts.createFile = true;
  opts.directory = `./output/${name}` || outputDirectoryPath;
  opts.fileName = `${name}_proof.json` || proofFileName;
  try {
    await zokrates.computeWitness(
      `./output/${name}/${name}_out`,
      `./output/${name}`,
      `${name}_witness`,
      witness,
    );
    await zokrates.generateProof(
      `./output/${name}/${name}_pk.key`,
      `./output/${name}/${name}_out`,
      `./output/${name}/${name}_witness`,
      `${process.env.PROVING_SCHEME}`,
      opts,
    );
    const storedProof = await saveProofToDB(docId, name, `./output/${name}/${name}_proof.json`);
    return res.send(storedProof);
  } catch (err) {
    return next(err);
  }
});

export default router;
