import fs from 'fs';
import db from '../db';

export const fileToJson = async filePath => {
const formattedObject = {};
fs.readFile(filePath, 'utf-8', (err, data) => {
  if (err) throw err;
  let arr = data.split('\n');
  for (let i = 0; i < arr.length; i++) {
    const currentElement = arr[i].split('=');
    formattedObject[currentElement[0].trim()] = formatArray(currentElement[1].trim());
  }
  console.log(JSON.stringify(formattedObject));
  fs.writeFile('formatted.json', JSON.stringify(formattedObject), err => {
    if (err) throw err;
    console.log('saved!');
  });
});
}

function formatArray(data) {
  if (data.startsWith('0x')) {
    return data.split(',').map(d => d.trim());
  } if (data.startsWith('[')) {
      return JSON.parse("[" + (data.replace(/\[/g, '["') .replace(/]/g, '"]') .replace(/(?<!\]),\s/g, '", "')) + "]" );
    } else {
        return data;
    }
}

export default {
  fileToJsons,
};