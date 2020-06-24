import express from 'express';
import fs from 'fs';
import path from 'path';
import { NatsService } from 'ts-natsutil';
import zokrates from '@eyblockchain/zokrates.js';
import { jsonifyVk } from '../utils/jsonifyVk';
import { saveVerificationKeyToDB } from '../utils/fileToDB';

const router = express.Router();

const publishArtifacts = (artifacts, bearerJWT) => {
  const natsUrl = process.env.NATS_URL;
  if (!natsUrl) {
    return;
  }
  const natsBearerJWT = process.env.NATS_BEARER_JWT || bearerJWT;
  const natsAuthToken = process.env.NATS_AUTH_TOKEN;
  const natsService = new NatsService([natsUrl], natsBearerJWT, natsAuthToken);
  natsService.connect().then(nc => {
    const payload = JSON.stringify(artifacts);
    nc.publish('zkp.compile.success', payload).then(() => {
      console.log(`published ${payload.length} NATS message containing compiled zkp artifacts`);
    });
  });
};

router.post('/', async (req, res, next) => {
  req.setTimeout(900000);
  const { filepath, jwt } = req.body;
  try {
    const filename = path.basename(filepath, '.zok'); // filename without '.zok'
    fs.mkdirSync(`./output/${filename}`, { recursive: true });

    console.log('\nCompile...');
    await zokrates.compile(`./circuits/${filepath}`, `./output/${filename}`, `${filename}_out`);
    const source = fs.readFileSync(`./circuits/${filepath}`);

    console.log('\nSetup...');
    await zokrates.setup(
      `./output/${filename}/${filename}_out`,
      `./output/${filename}`,
      `${process.env.PROVING_SCHEME}`,
      `${filename}_vk`,
      `${filename}_pk`,
    );

    console.log('\nFormat VK...');
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
    console.log(`\nComplete`);
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
    return next(err);
  }
});

export default router;
