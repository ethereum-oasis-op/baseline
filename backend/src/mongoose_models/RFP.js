'use strict';

const mongoose = require('mongoose');

const RFPSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      lowercase: true,
      trim: true,
    }
  },
  {
    collection: "RFPs",
    versionKey: false,
    strict: false
  });

// If user updates their own RFP instance, alert other Entangled parties
RFPSchema.post('updateOne', async function (doc) {
  // Check if this RFP has an Entanglement
  const entangleUtils = require('../entanglementUtils');
  let entangledDoc = await entangleUtils.getSingleEntanglement({ databaseLocation: { collection: 'RFPs', objectId: doc._id } });
  if (entangledDoc) {
    console.info('Found Entanglement for RFP. Updating now...');
    // Update hash in Entanglement and send a message to each participant
    const WhisperWrapper = require('../WhisperWrapper');
    let messenger = await new WhisperWrapper();
    await entangleUtils.selfUpdateEntanglement(messenger, entangledDoc, 'RFPs', doc._id);
  }
})

RFPSchema.post('findOneAndUpdate', async function (doc) {
  // Check if this RFP has an Entanglement
  const entangleUtils = require('../entanglementUtils');
  let entangledDoc = await entangleUtils.getSingleEntanglement({ databaseLocation: { collection: 'RFPs', objectId: doc._id } });
  if (entangledDoc) {
    console.info('Found Entanglement for RFP. Updating now...');
    // Update hash in Entanglement and send a message to each participant
    const WhisperWrapper = require('../WhisperWrapper');
    let messenger = await new WhisperWrapper();
    await entangleUtils.selfUpdateEntanglement(messenger, entangledDoc, 'RFPs', doc._id);
  }
})

const RFPs = mongoose.model('RFPs', RFPSchema);

module.exports = RFPs;
