import express from 'express';
import fs from 'fs';
import path from 'path';
import zokrates from '@eyblockchain/zokrates.js';
import { jsonifyVk } from '../utils/jsonifyVk';
import { saveVerificationKeyToDB } from '../utils/fileToDB';
import { logger } from 'radish34-logger';

const router = express.Router();

const publishArtifacts = (artifacts, bearerJWT) => {
  // FIXME
};

router.post('/', async (req, res, next) => {
  req.setTimeout(900000);
  const { filepath, jwt } = req.body;
  try {
    const filename = path.basename(filepath, '.zok'); // filename without '.zok'
    fs.mkdirSync(`./output/${filename}`, { recursive: true });

    logger.info('Compile.', { service: 'ZKP' });
    await zokrates.compile(`./circuits/${filepath}`, `./output/${filename}`, `${filename}_out`);
    const source = fs.readFileSync(`./circuits/${filepath}`);

    logger.info('Setup.', { service: 'ZKP' });
    await zokrates.setup(
      `./output/${filename}/${filename}_out`,
      `./output/${filename}`,
      `${process.env.PROVING_SCHEME}`,
      `${filename}_vk`,
      `${filename}_pk`,
    );

    logger.info('Format vk.', { service: 'ZKP' });
    await zokrates.exportVerifier(
      `./output/${filename}/${filename}_vk.key`,
      `./output/${filename}`,
      `Verifier_${filename}.sol`,
      `${process.env.PROVING_SCHEME}`,
    );

    const proofRaw = fs.readFileSync(`./output/${filename}/${filename}_out.ztf`);
    const provingKey = fs.readFileSync(`./output/${filename}/${filename}_pk.key`);
    const verifierSolc = fs.readFileSync(`./output/${filename}/Verifier_${filename}.sol`);
    const vkJson = await jsonifyVk(`./output/${filename}/Verifier_${filename}.sol`);
    const vk = await saveVerificationKeyToDB(filename, JSON.parse(vkJson));
    logger.info('Complete.\n%o', vk, { service: 'ZKP' });
    const response = { verificationKey: vk };

    const artifacts = {
      key_id: filename,
      proof: proofRaw,
      proving_key: provingKey,
      source: source.toString(),
      verifier_solc: verifierSolc,
      verification_key: JSON.parse(vkJson),
    };

    publishArtifacts(artifacts, jwt);

    return res.send(response);
  } catch (err) {
    logger.error('\n%o', { error: err }, { service: 'ZKP' });
    return next(err);
  }
});

export default router;
