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

const listenerFunction = async function (doc, entangleUtils) {
  // Check if this RFP has an Entanglement
  let entangledDoc = await entangleUtils.getSingleEntanglement({ databaseLocation: { collection: 'RFPs', objectId: this.doc._id } });
  if (entangledDoc) {
    console.info('Found Entanglement for RFP. Updating now...');
    // Update hash in Entanglement and send a message to each participant
    await entangleUtils.selfUpdateEntanglement(entangledDoc, 'RFPs', this.doc._id);
  }
}

RFPSchema.methods.addListener = async function (entangleUtils) {
  // If user updates their own RFP instance, alert other Entangled parties
  await this.post('updateOne', listenerFunction(entangleUtils));
  await this.post('findOneAndUpdate', listenerFunction(entangleUtils));
}

module.exports = RFPSchema;
