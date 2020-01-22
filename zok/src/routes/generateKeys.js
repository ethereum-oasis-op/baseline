import express from 'express';
import fs from 'fs';
import path from 'path';
import zokrates from '@eyblockchain/zokrates.js';
import { saveVerificationKeyToDB } from '../utils/fileToDB';

const router = express.Router();

router.post('/', async (req, res, next) => {
  const { filepath } = req.body;
  try {
    const filename = path.basename(filepath, '.zok'); // filename without '.zok'
    fs.mkdirSync(`/app/output/${filename}`, { recursive: true });
    await zokrates.compile(`./zok/${filepath}`, `./output/${filename}`, `${filename}_out`);
    await zokrates.setup(
      `./output/${filename}/${filename}_out`,
      `./output/${filename}`,
      `${process.env.PROVING_SCHEME}`,
      `${filename}_vk`,
      `${filename}_pk`,
    );
    await zokrates.exportVerifier(
      `./output/${filename}/${filename}_vk.key`,
      `./output/${filename}`,
      `Verifier_${filename}.sol`,
      `${process.env.PROVING_SCHEME}`,
    );
    const vk = await saveVerificationKeyToDB(filename, `./output/${filename}/${filename}_vk.key`);
    const response = { verificationKeyID: vk._id, verificationKey: vk.vk };
    return res.send(response);
  } catch (err) {
    return next(err);
  }
});

export default router;
