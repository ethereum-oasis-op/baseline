const Entanglement = require('./mongoose_models/Entanglement');

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

module.exports = {
  getEntanglements,
  getSingleEntanglement,
  updateEntanglement
};