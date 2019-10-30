'use strict';

const mongoose = require('mongoose');

const SymmetricKeySchema = new mongoose.Schema({
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
  topic: {
    type: String,
    required: true
  },
  created: String
},
  {
    collection: "SymmetricKeys",
    versionKey: false,
  });

const SymmetricKeys = mongoose.model('SymmetricKeys', SymmetricKeySchema);

module.exports = SymmetricKeys;
