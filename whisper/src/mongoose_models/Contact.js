'use strict';

const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
  _id: {
    type: String,
    lowercase: true,
    trim: true,
  },
  description: String,
  whisperPublicKey: String,
  ethereumPublicKey: String,
  created: {
    instanceof: Date
  }
},
  {
    collection: "Contacts",
    versionKey: false,
  });

const Contacts = mongoose.model('Contacts', ContactSchema);

module.exports = Contacts;
