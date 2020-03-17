import fs from 'fs';

export const getContractJSON = filename => {
  const path = `./artifacts/${filename}.json`;
  if (fs.existsSync(filename)) {
    const contract = fs.readFileSync(path);
    return JSON.parse(contract);
  }
  console.log('Unable to locate file: ', path);
  throw ReferenceError(`${filename} not found at ${path}`);
};

export default {
  getContractJSON,
};
