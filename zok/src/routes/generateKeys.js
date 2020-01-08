import express from 'express';
import zokrates from '@eyblockchain/zokrates.js';
import fs from 'fs';
import { saveVerificationKeyToDB } from '../utils/fileToDB';

const router = express.Router();

router.post('/', async (req, res, next) => {
  const { name } = req.body;
  try {
    fs.mkdirSync(`/app/output/${name}`, { recursive: true });
    await zokrates.compile(`./code/${name}.code`, `./output/${name}`, `${name}_out`);
    await zokrates.setup(
      `./output/${name}/${name}_out`,
      `./output/${name}`,
      `${process.env.PROVING_SCHEME}`,
      `${name}_vk`,
      `${name}_pk`,
    );
    await zokrates.exportVerifier(
      `./output/${name}/${name}_vk.key`,
      `./output/${name}`,
      `Verifier_${name}.sol`,
      `${process.env.PROVING_SCHEME}`,
    );
    const vk = await saveVerificationKeyToDB(name, `./output/${name}/${name}_vk.key`);
    const response = { verificationKeyID: vk._id, verificationKey: vk.vk };
    return res.send(response);
  } catch (err) {
    return next(err);
  }
});

export default router;
