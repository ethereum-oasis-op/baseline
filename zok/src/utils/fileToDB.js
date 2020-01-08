import fs from 'fs';
import db from './db';

const formatArray = data => {
  if (data.startsWith('0x')) {
    return data.split(',').map(d => d.trim());
  }
  if (data.startsWith('[')) {
    return JSON.parse(
      `[${data
        .replace(/\[/g, '["')
        .replace(/]/g, '"]')
        .replace(/(?<!\]),\s/g, '", "')}]`,
    );
  }
  return data;
};

export const getVerificationKeyByID = async id => {
  const vk = await db.collection('verificationKey').findOne({ _id: id });
  return vk;
};

export const saveVerificationKeyToDB = async (keyID, filePath) => {
  const formattedObject = {};
  const array = fs
    .readFileSync(filePath)
    .toString()
    .split('\n');
  for (let i = 0; i < array.length; i += 1) {
    const currentElement = array[i].split('=');
    formattedObject[currentElement[0].trim()] = formatArray(currentElement[1].trim());
  }
  await db
    .collection('verificationKey')
    .updateOne({ _id: keyID }, { $set: formattedObject }, { upsert: true });
  const vk = await getVerificationKeyByID(keyID);
  return vk;
};

const readJsonFile = filePath => {
  if (fs.existsSync(filePath)) {
    const file = fs.readFileSync(filePath);
    return JSON.parse(file);
  }
  console.log('Unable to locate file: ', filePath);
  throw ReferenceError('file not found');
};

export const getProofByDocID = async DocId => {
  const proof = await db.collection('proof').findOne({ _id: DocId });
  delete proof._id;
  return proof;
};

export const saveProofToDB = async (docID, keyID, filePath) => {
  const proof = readJsonFile(filePath);
  const formattedObject = {
    docID: docID,
    verificationKeyID: keyID,
    verificationKey: await getVerificationKeyByID(keyID),
    proof,
  };
  await db
    .collection('proof')
    .updateOne({ _id: docID }, { $set: formattedObject }, { upsert: true });
  const storedProof = await getProofByDocID(docID);
  delete storedProof._id;
  return storedProof;
};

export default {
  saveVerificationKeyToDB,
  saveProofToDB,
  getVerificationKeyByID,
  getProofByDocID,
};
