import express from 'express';
import zokrates from '@eyblockchain/zokrates.js';
import { saveProofToDB } from '../utils/fileToDB';
import { logger } from 'radish34-logger';

const router = express.Router();

router.post('/', async (req, res, next) => {
  req.setTimeout(900000);
  const { docId, filename, inputs, outputDirectoryPath, proofFileName } = req.body;

  const opts = {};
  opts.createFile = true;
  opts.directory = `./output/${filename}` || outputDirectoryPath;
  opts.fileName = `${filename}_proof.json` || proofFileName;
  try {
    logger.info('Compute witness.', { service: 'ZKP' });
    await zokrates.computeWitness(
      `./output/${filename}/${filename}_out`,
      `./output/${filename}/`,
      `${filename}_witness`,
      inputs,
    );

    logger.info('Generate proof.', { service: 'ZKP' });
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

    logger.info('Proof generation complete. Responding with proof.\n%o', storedProof, { service: 'ZKP' });
    return res.send(storedProof);
  } catch (err) {
    logger.error('\n%o', err, { service: 'ZKP' });
    return next(err);
  }
});

export default router;
