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

router.post('/:circuitId', async (req, res, next) => {
  req.setTimeout(900000);
  const { circuitId } = req.params;
  const { docId, inputs } = req.body;
  console.log(`\nReceived request to /generateProof`);

  const timestamp = new Date().getTime();
  const witnessFilename = `${circuitId}-${timestamp}_witness`;
  const proofFilename = `${circuitId}-${timestamp}_proof.json`;

  const opts = {};
  opts.createFile = true;
  opts.directory = `./output/${circuitId}`;
  opts.fileName = proofFilename;
  try {
    console.log('\nCompute witness...');
    await zokrates.computeWitness(
      `./output/${circuitId}/${circuitId}_out`,
      `./output/${circuitId}/`,
      witnessFilename,
      inputs,
    );

    console.log('\nGenerate proof...');
    await zokrates.generateProof(
      `./output/${circuitId}/${circuitId}_pk.key`,
      `./output/${circuitId}/${circuitId}_out`,
      `./output/${circuitId}/${witnessFilename}`,
      `${process.env.PROVING_SCHEME}`,
      opts,
    );
    const storedProof = await saveProofToDB(
      docId,
      circuitId,
      `./output/${circuitId}/${proofFilename}`,
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
