import express from 'express';
import zokrates from '@eyblockchain/zokrates.js';
import { saveProofToDB } from '../utils/fileToDB';

const router = express.Router();

router.post('/', async (req, res, next) => {
  req.setTimeout(900000);
  const { docId, filename, inputs, outputDirectoryPath, proofFileName } = req.body;
  console.log(`\nReceived request to /generateProof`);
  console.log(req.body);

  const opts = {};
  opts.createFile = true;
  opts.directory = `./output/${filename}` || outputDirectoryPath;
  opts.fileName = `${filename}_proof.json` || proofFileName;
  try {
    console.log('\nCompute witness...');
    await zokrates.computeWitness(
      `./output/${filename}/${filename}_out`,
      `./output/${filename}/`,
      `${filename}_witness`,
      inputs,
    );

    console.log('\nGenerate proof...');
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

    console.log(`\nComplete`);
    console.log(`\nResponding with proof:`);
    console.log(storedProof);
    return res.send(storedProof);
  } catch (err) {
    return next(err);
  }
});

export default router;
