'use strict';

const mongoose = require('mongoose');

const EntanglementSchema = new mongoose.Schema({
  _id: {
    type: String,
    lowercase: true,
    trim: true,
  },
  // A shared symmetric key will be used by all participants so we are
  // not limited to two participants. The original entanglement requestor's
  // Radish engine will randomly generate the topic and key
  whisper: {
    topic: {
      type: String  // Four bytes long: '0x11223344'
    },
    symmetricKeyId: {
      type: String
    },
    symmetricKey: {
      type: String
    }
  },
  dataField: {
    value: String,
    dataId: String,
    description: String
  },
  // If (acceptedRequest == true) for all participants, 
  // entanglement's state = yellow
  participants: [{
    _id: false,
    contactId: {
      type: String
    },
    acceptedRequest: {
      type: Boolean
    }
  }],
  // Store on-chain hashes to use as shared source of truth for data value
  blockchain: {
    contractAddress: String,
    setMethodId: String,  // Four bytes long: '0x11223344'
    getMethodId: String   // Four bytes long: '0x11223344'
  },
  created: {
    instanceof: Date
  },
  lastUpdated: {
    instanceof: Date
  }
},
  {
    collection: "Entanglements",
    versionKey: false,
  });

const Entanglements = mongoose.model('Entanglements', EntanglementSchema);

module.exports = Entanglements;
