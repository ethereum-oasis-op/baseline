import express from 'express';
import zokrates from '@eyblockchain/zokrates.js';
import { saveProofToDB } from '../utils/fileToDB';

const router = express.Router();

router.post('/', async (req, res, next) => {
  const { docId, filename, witness, outputDirectoryPath, proofFileName } = req.body;
  const opts = {};
  opts.createFile = true;
  opts.directory = `./output/${filename}` || outputDirectoryPath;
  opts.fileName = `${filename}_proof.json` || proofFileName;
  try {
    await zokrates.computeWitness(
      `./output/${filename}/${filename}_out`,
      `./output/${filename}/`,
      `${filename}_witness`,
      witness,
    );
    await zokrates.generateProof(
      `./output/${filename}/${filename}_pk.key`,
      `./output/${filename}/${filename}_out`,
      `./output/${filename}/${filename}_witness`,
      `${process.env.PROVING_SCHEME}`,
      opts,
    );
    const storedProof = await saveProofToDB(
      docId,
      filename,
      `./output/${filename}/${filename}_proof.json`,
    );
    return res.send(storedProof);
  } catch (err) {
    return next(err);
  }
});

export default router;
