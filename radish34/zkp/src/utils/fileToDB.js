import fs from 'fs';
import db from './db';
import { jsonifyVk } from './jsonifyVk';
import { logger } from 'radish34-logger';

/**
The vk's keys tend to be stored alphabetically in the db. But we need the following exact order, or everything will break:
*/
const reorderVerificationKey = vk => {
  const { H, Galpha, Hbeta, Ggamma, Hgamma, query } = vk;
  return { H, Galpha, Hbeta, Ggamma, Hgamma, query };
};

export const getVerificationKeyByID = async id => {
  const vk = await db
    .collection('verificationKey')
    .findOne({ _id: id }, { projection: { _id: 0 } });
  const reorderedVk = vk === null ? vk : reorderVerificationKey(vk);
  return reorderedVk;
};

export const saveVerificationKeyToDB = async (keyID, _vk) => {
  await db.collection('verificationKey').updateOne({ _id: keyID }, { $set: _vk }, { upsert: true });
  const vk = await getVerificationKeyByID(keyID);
  return vk;
};

const readJsonFile = filePath => {
  if (fs.existsSync(filePath)) {
    const file = fs.readFileSync(filePath);
    return JSON.parse(file);
  }
  logger.error(`Unable to locate file: ${filePath}.`, { service: 'ZKP' });
  throw ReferenceError('File not found.');
};

export const getProofByDocID = async id => {
  const proof = await db.collection('proof').findOne({ _id: id }, { projection: { _id: 0 } });
  return proof;
};

export const saveProofToDB = async (docID, keyID, filePath) => {
  const { proof, inputs } = readJsonFile(filePath);
  const formattedObject = {
    docID: docID,
    verificationKeyID: keyID,
    proof,
    inputs,
  };
  await db
    .collection('proof')
    .updateOne({ _id: docID }, { $set: formattedObject }, { upsert: true });
  const storedProof = await getProofByDocID(docID);
  return storedProof;
};

export const checkForNewVks = async () => {
  logger.info('Checking for new verification keys...', { service: 'ZKP' });
  let newVkCount = 0;
  const circuitNames = fs.readdirSync(`/app/output/`);

  // eslint-disable-next-line no-restricted-syntax
  for (const circuitName of circuitNames) {
    const verifierPath = `/app/output/${circuitName}/Verifier_${circuitName}.sol`;
    const vkPath = `/app/output/${circuitName}/${circuitName}_vk.key`;

    if (!(fs.existsSync(vkPath) && fs.existsSync(verifierPath))) continue; // eslint-disable-line no-continue

    // check to see if any of these circuits are not yet stored in the mongo db:
    const doc = await getVerificationKeyByID(circuitName);
    if (doc === null) {
      logger.info(`New vk for ${circuitName} found. Storing it in the Mongo db.`, { service: 'ZKP' });
      newVkCount += 1;
      const vkJson = await jsonifyVk(verifierPath);
      await saveVerificationKeyToDB(circuitName, JSON.parse(vkJson));
    }
  }

  if (newVkCount === 0) logger.info('No new vks found.', { service: 'ZKP' });
};

export default {
  saveVerificationKeyToDB,
  saveProofToDB,
  getVerificationKeyByID,
  getProofByDocID,
  checkForNewVks,
};
