import express from 'express';
import fs from 'fs';
import path from 'path';
import zokrates from '@eyblockchain/zokrates.js';
import { jsonifyVk } from '../utils/jsonifyVk';
import { saveVerificationKeyToDB } from '../utils/fileToDB';

const router = express.Router();

router.post('/', async (req, res, next) => {
  req.setTimeout(900000);
  const { filepath } = req.body;
  try {
    const filename = path.basename(filepath, '.zok'); // filename without '.zok'
    fs.mkdirSync(`/app/output/${filename}`, { recursive: true });

    console.log('\nCompile...');
    await zokrates.compile(`./circuits/${filepath}`, `./output/${filename}`, `${filename}_out`);

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

    const vkJson = await jsonifyVk(`./output/${filename}/Verifier_${filename}.sol`);
    const vk = await saveVerificationKeyToDB(filename, JSON.parse(vkJson));
    console.log(`\nComplete`);
    const response = { verificationKey: vk };
    return res.send(response);
  } catch (err) {
    return next(err);
  }
});

export default router;
