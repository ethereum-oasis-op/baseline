
function hasJsonStructure(str) {
  if (typeof str !== 'string') return false;
  try {
    const result = JSON.parse(str);
    const type = Object.prototype.toString.call(result);
    const isJSON = (type === '[object Object]' || type === '[object Array]');
    return [isJSON, result];
  } catch (err) {
    return [false, {}];
  }
};

// ***** Usage *****
// const [err, result] = safeJsonParse('[Invalid JSON}');
// if (err) console.log('Failed to parse JSON: ' + err.message);
// else console.log(result);
function safeJsonParse(str) {
  try {
    return [null, JSON.parse(str)];
  } catch (err) {
    return [err];
  }
};

async function addDbListener(doc, collectionName) {
  // Check if this RFP has an Entanglement
  const entangleUtils = require('./entanglementUtils');
  let entangledDoc = await entangleUtils.getSingleEntanglement({ databaseLocation: { collection: collectionName, objectId: doc._id } });
  if (entangledDoc) {
    console.info('Found Entanglement for RFP. Updating now...');
    // Update hash in Entanglement and send a message to each participant
    const WhisperWrapper = require('./WhisperWrapper');
    let messenger = await new WhisperWrapper();
    await entangleUtils.selfUpdateEntanglement(messenger, entangledDoc, collectionName, doc._id);
  }
}

module.exports = {
  hasJsonStructure,
  safeJsonParse,
  addDbListener
};