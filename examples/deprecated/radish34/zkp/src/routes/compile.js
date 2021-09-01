import express from 'express';
import fs from 'fs';
import path from 'path';
import zokrates from '@eyblockchain/zokrates.js';
import { jsonifyVk } from '../utils/jsonifyVk';
import { saveVerificationKeyToDB } from '../utils/fileToDB';

const defaultProvingScheme = 'gm17';

const router = express.Router();

const publishArtifacts = (artifacts, bearerJWT) => {
  // FIXME
};

router.post('/', async (req, res, next) => {
  req.setTimeout(900000);
  const { name, source, scheme, jwt } = req.body;
  try {
    const circuitId = path.basename(`${name}-${new Date().getTime()}`, '.zok'); // filename without '.zok'
    fs.mkdirSync(`/app/output/${circuitId}`, { recursive: true });
    fs.writeFileSync(`/app/output/${circuitId}/${circuitId}.zok`, source);

    console.log('\nCompile...');
    await zokrates.compile(
      `/app/output/${circuitId}/${circuitId}.zok`,
      `/app/output/${circuitId}`,
      `${circuitId}_out`,
    );

    console.log('\nSetup...');
    await zokrates.setup(
      `/app/output/${circuitId}/${circuitId}_out`,
      `/app/output/${circuitId}`,
      `${scheme || process.env.PROVING_SCHEME || defaultProvingScheme}`,
      `${circuitId}_vk`,
      `${circuitId}_pk`,
    );

    console.log('\nFormat VK...');
    await zokrates.exportVerifier(
      `/app/output/${circuitId}/${circuitId}_vk.key`,
      `/app/output/${circuitId}`,
      `Verifier_${circuitId}.sol`,
      `${scheme || process.env.PROVING_SCHEME || defaultProvingScheme}`,
    );

    const zokTextFormat = fs.readFileSync(`/app/output/${circuitId}/${circuitId}_out.ztf`);
    const provingKey = fs.readFileSync(`/app/output/${circuitId}/${circuitId}_pk.key`);
    const verifierSolc = fs.readFileSync(`/app/output/${circuitId}/Verifier_${circuitId}.sol`);
    const vkJson = await jsonifyVk(`/app/output/${circuitId}/Verifier_${circuitId}.sol`);
    const vk = await saveVerificationKeyToDB(circuitId, JSON.parse(vkJson));

    console.log(`\nComplete`);
    const response = { verificationKey: vk };

    // FIXME-- upload provingKey to IPFS or similar...

    const artifacts = {
      circuit: circuitId,
      proving_key: provingKey,
      source: source.toString(),
      verifier_solc: verifierSolc,
      verification_key: JSON.parse(vkJson),
      ztf: zokTextFormat,
    };

    publishArtifacts(artifacts, jwt);

    return res.send(response);
  } catch (err) {
    console.log(err);
    return next(err);
  }
});

export default router;
