import express from 'express';
import fs from 'fs';
import zokrates from '@eyblockchain/zokrates.js';
import { saveProofToDB } from '../utils/fileToDB';

const defaultProvingScheme = 'gm17';

const router = express.Router();

router.post('/', async (req, res, next) => {
  req.setTimeout(900000);
  const { docId, filename, inputs, scheme, outputDirectoryPath, proofFileName } = req.body;
  console.log(`\nReceived request to /generateProof`);
  console.log(req.body);

  const opts = {};
  opts.createFile = true;
  opts.directory = `/app/output/${filename}` || outputDirectoryPath;
  opts.fileName = `${filename}_proof.json` || proofFileName;
  fs.mkdirSync(opts.directory, { recursive: true });

  try {
    console.log('\nCompute witness...');
    await zokrates.computeWitness(
      `/app/output/${filename}/${filename}_out`,
      `/app/output/${filename}/`,
      `${filename}_witness`,
      inputs,
    );

    console.log('\nGenerate proof...');
    await zokrates.generateProof(
      `/app/output/${filename}/${filename}_pk.key`,
      `/app/output/${filename}/${filename}_out`,
      `/app/output/${filename}/${filename}_witness`,
      `${scheme || process.env.PROVING_SCHEME || defaultProvingScheme}`,
      opts,
    );
    const storedProof = await saveProofToDB(
      docId,
      filename,
      `/app/output/${filename}/${filename}_proof.json`,
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
  const { docId, inputs, scheme } = req.body;
  console.log(`\nReceived request to /generateProof`);

  const timestamp = new Date().getTime();
  const witnessFilename = `${circuitId}-${timestamp}_witness`;
  const proofFilename = `${circuitId}-${timestamp}_proof.json`;

  const opts = {};
  opts.createFile = true;
  opts.directory = `/app/output/${circuitId}/${timestamp}`;
  opts.fileName = proofFilename;
  fs.mkdirSync(opts.directory, { recursive: true });

  try {
    console.log('\nCompute witness...');
    await zokrates.computeWitness(
      `/app/output/${circuitId}/${circuitId}_out`,
      `/app/output/${circuitId}/${timestamp}`,
      witnessFilename,
      inputs,
    );

    console.log('\nGenerate proof...');
    await zokrates.generateProof(
      `/app/output/${circuitId}/${circuitId}_pk.key`,
      `/app/output/${circuitId}/${circuitId}_out`,
      `/app/output/${circuitId}/${timestamp}/${witnessFilename}`,
      `${scheme || process.env.PROVING_SCHEME || defaultProvingScheme}`,
      opts,
    );

    const proof = await saveProofToDB(
      docId,
      circuitId,
      `/app/output/${circuitId}/${timestamp}/${proofFilename}`,
    );

    console.log(`\nComplete`);
    console.log(`\nResponding with proof:`);
    console.log(proof);
    return res.send(proof);
  } catch (err) {
    return next(err);
  }
});

export default router;
