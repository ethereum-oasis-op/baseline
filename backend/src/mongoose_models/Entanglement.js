'use strict';

const mongoose = require('mongoose');

const EntanglementSchema = new mongoose.Schema({
  _id: {
    type: String,
    lowercase: true,
    trim: true,
  },
  // Link to business object (RFQ, PO, invoice, etc.) in user's db
  databaseLocation: {
    collection: String,
    objectId: String
  },
  // If (acceptedRequest == true) for all participants, 
  // entanglement's state = yellow
  participants: [{
    _id: false,
    isSelf: Boolean,
    messengerId: {
      type: String
    },
    acceptedRequest: {
      type: Boolean
    },
    dataHash: String,
    lastUpdated: String
  }],
  // Store on-chain hashes to use as shared source of truth for data value
  blockchain: {
    contractAddress: String,
    setMethodId: String,  // Four bytes long: '0x11223344'
    getMethodId: String   // Four bytes long: '0x11223344'
  },
  created: String
},
  {
    collection: "Entanglements",
    versionKey: false,
  });

const Entanglements = mongoose.model('Entanglements', EntanglementSchema);

module.exports = Entanglements;
