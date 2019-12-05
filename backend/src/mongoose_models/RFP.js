'use strict';

const mongoose = require('mongoose');
const genUtils = require('../generalUtils');

const collectionName = 'RFPs';
const RFPSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      lowercase: true,
      trim: true,
    }
  },
  {
    collection: collectionName,
    versionKey: false,
    strict: false
  });

// If user updates their own RFP instance, alert other Entangled parties
RFPSchema.post('updateOne', async function (doc) {
  await genUtils.addDbListener(doc, collectionName);
});

RFPSchema.post('findOneAndUpdate', async function (doc) {
  await genUtils.addDbListener(doc, collectionName);
});

const RFPs = mongoose.model(collectionName, RFPSchema);

module.exports = RFPs;
