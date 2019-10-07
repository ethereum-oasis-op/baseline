const Entanglement = require('./mongoose_models/Entanglement');
const Web3 = require('web3');

// Get all Entanglement objects for the given user
// Get all Entanglements if no user is provided
async function getEntanglements(userId) {
  let result
  if (userId) {
    result = await Entanglement.find({ 'participants.contactId': userId });
  } else {
    result = await Entanglement.find({});
  }
  return result;
}

// Get all Entanglement objects for the given user
async function getSingleEntanglement(entanglementId) {
  let result = await Entanglement.find({ _id: entanglementId });
  return result;
}

// Update a single Entanglement
async function updateEntanglement(entanglementId, doc) {
  let result = await Entanglement.find({ _id: entanglementId, 'participants.contactId': senderId });
  return result;
}

// Calculate the hash of an Entanglement
async function calculateHash(entanglementId) {
  let web3 = new Web3();
  let entanglement = await Entanglement.findOne({ _id: entanglementId });
  let hashObject = {
    dataField: entanglement.dataField,
    created: entanglement.time
  };
  let hash = web3.utils.sha3(JSON.stringify(hashObject));
  return hash;
}

module.exports = {
  getEntanglements,
  getSingleEntanglement,
  updateEntanglement,
  calculateHash
};