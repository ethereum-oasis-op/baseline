import fs from 'fs';
import db from '../db';

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
  return keyID;
};

const readJsonFile = filePath => {
  if (fs.existsSync(filePath)) {
    const file = fs.readFileSync(filePath);
    return JSON.parse(file);
  }
  console.log('Unable to locate file: ', filePath);
  throw ReferenceError('file not found');
};

export const saveProofToDB = async (docID, keyID, filePath) => {
  const proof = readJsonFile(filePath);
  const formattedObject = { docID: docID, keyId: keyID, data: proof };
  await db
    .collection('proof')
    .updateOne({ _id: docID }, { $set: formattedObject }, { upsert: true });
  return docID;
};

export default {
  saveVerificationKeyToDB,
  saveProofToDB,
};
