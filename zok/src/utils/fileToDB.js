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
  const vk = await db
    .collection('verificationKey')
    .updateOne({ _id: keyID }, { $set: formattedObject }, { upsert: true });
  console.log('the saved data is: ', JSON.stringify(formattedObject));
  return keyID;
};

export default {
  saveVerificationKeyToDB,
};
