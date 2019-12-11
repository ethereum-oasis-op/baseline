'use strict';

const mongoose = require('mongoose');

const IdentitySchema = new mongoose.Schema({
  _id: {
    type: String,
    lowercase: true,
    trim: true,
  },
  keyId: {
    type: String,
    required: true,
  },
  description: String,
  publicKey: {
    type: String,
    required: true
  },
  privateKey: {
    type: String,
    required: true
  },
  createdDate: String
},
  {
    collection: "Identities",
    versionKey: false,
  });

const Identities = mongoose.model('Identities', IdentitySchema);

module.exports = Identities;
