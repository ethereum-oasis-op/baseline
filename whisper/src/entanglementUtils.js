const hash = require('object-hash');
const randomstring = require("randomstring");
const Identity = require('./mongoose_models/Identity');
const Entanglement = require('./mongoose_models/Entanglement');
const RFQutils = require('./RFQutils');

class EntanglementUtils {
  constructor(messengerInstance) {
    this.messenger = messengerInstance;
  }

  async createEntanglement(doc) {
    var entangleID = randomstring.generate({
      length: 60,
      charset: 'alphanumeric',
      capitalization: 'lowercase'
    });
    let time = await Math.floor(Date.now() / 1000);;
    let hash = await this.calculateHash(doc.databaseLocation.collection, doc.databaseLocation.objectId);
    // TODO deploy Consistency smart contract and initiate dataHash
    // Store hash in contract under my Eth address for this dataId

    // If messengerId not provided, default to first messengerId in Identities collection
    let myId = doc.messengerId;
    if (!myId) {
      myId = await Identity.findOne({});
    }
    // Add self as a participant, then add rest of participants listed in req.body
    let participants = [{ messengerId: myId, isSelf: true, acceptedRequest: true, dataHash: hash, lastUpdated: time }];
    await doc.partnerIds.forEach(messengerId => {
      participants.push({ messengerId: messengerId, acceptedRequest: false });
    });
    let result = await Entanglement.findOneAndUpdate(
      { _id: entangleID },
      {
        _id: entangleID,
        databaseLocation: {
          collection: doc.databaseLocation.collection,
          objectId: doc.databaseLocation.objectId
        },
        participants: participants,
        blockchain: doc.blockchain,
        created: time
      },
      { upsert: true, new: true }
    );

    // Create Entanglement request object to send as Whisper private message
    let entangleRequest = {
      _id: entangleID,
      type: 'entanglement_request',
      participants: participants,
      blockchain: doc.blockchain,
      created: time
    };
    // Send a private message to each participant inviting them to the entanglement channel
    doc.partnerIds.forEach(async (partnerId) => {
      await this.messenger.sendPrivateMessage(myId, partnerId, undefined, JSON.stringify(entangleRequest));
    });
    return result;
  }

  // Get all Entanglement objects for the given user
  // Get all Entanglements if no user is provided
  async getEntanglements(userId) {
    let result;
    if (userId) {
      result = await Entanglement.find({ 'participants.messengerId': userId });
    } else {
      result = await Entanglement.find({});
    }
    return result;
  }

  // Get all Entanglement objects for the given user
  async getSingleEntanglement(query) {
    let result = await Entanglement.findOne(query);
    return result;
  }

  // Update a single Entanglement (initiated by partner message)
  async updateEntanglement(data, messageObj) {
    let result = await Entanglement.findOne({ _id: messageObj._id });
    // Verify sender of message is a participant in the Entanglement before allowing the update
    let index = result.participants.findIndex(({ messengerId }) => messengerId === data.sig);
    if (index < 0) {
      console.error(`Cannot update Entanglement. Invalid messengerId (${data.sig}) trying to make update.`);
      return;
    }
    let time = await Math.floor(Date.now() / 1000);
    result.participants[index].dataHash = messageObj.dataHash;
    result.participants[index].lastUpdated = time;
    let updated = await Entanglement.findOneAndUpdate(
      { _id: messageObj._id },
      {
        participants: result.participants,
      },
      { new: true }
    );
    return updated;
  }

  // Update a single Entanglement
  // Initiated by db listener triggered by internal change to business object
  async selfUpdateEntanglement(entanglementDoc, collectionName, docId) {
    let index = await entanglementDoc.participants.findIndex(({ isSelf }) => isSelf === true);
    if (index < 0) {
      console.error(`Failed to find own messengerId in Entanglement participants.`);
      return;
    }
    let time = await Math.floor(Date.now() / 1000);
    let dataHash = await this.calculateHash(collectionName, docId);
    let myMessengerId = entanglementDoc.participants[index].messengerId;
    entanglementDoc.participants[index].dataHash = dataHash;
    entanglementDoc.participants[index].lastUpdated = time;
    let updated = await Entanglement.findOneAndUpdate(
      { _id: entanglementDoc._id },
      {
        participants: entanglementDoc.participants,
      },
      { new: true }
    );

    // Create Entanglement update object to send as Whisper private message
    let entangleMessage = {
      _id: updated._id,
      type: 'entanglement_update',
      dataHash: dataHash,
      lastUpdated: time
    };

    // Send a private message to each participant inviting them to the entanglement channel
    entanglementDoc.participants.forEach(async ({ partnerId, isSelf }) => {
      // Don't send message to self
      if (!isSelf) {
        await this.messenger.sendPrivateMessage(myMessengerId, partnerId, undefined, JSON.stringify(entangleMessage));
      }
    });
    return result;
  }

  // Set acceptedRequest for my messengerId to 'true'
  //    messengerId: 0x... (required)
  //    acceptedRequest: Boolean (optional)
  async acceptEntanglement(entanglementId, doc) {
    let time = await Math.floor(Date.now() / 1000);
    let entangleObject = await Entanglement.findOne({ _id: entanglementId });
    let userIndex = await entangleObject.participants.findIndex(({ messengerId }) => messengerId === doc.messengerId);
    entangleObject.participants[userIndex].acceptedRequest = true;
    let result = await Entanglement.findOneAndUpdate(
      { _id: entanglementId },
      {
        participants: entangleObject.participants,
        lastUpdated: time
      },
      { new: true }
    );

    // Create Entanglement accept object to send as Whisper private message
    let entangleMessage = {
      _id: entanglementId,
      type: 'entanglement_accept',
      lastUpdated: time
    };

    // Send a private message to each participant inviting them to the entanglement channel
    entangleObject.participants.forEach(async ({ partnerId, isSelf }) => {
      // Don't send message to self
      if (!isSelf) {
        await this.messenger.sendPrivateMessage(doc.messengerId, partnerId, undefined, JSON.stringify(entangleMessage));
      }
    });
    return result;
  }

  // Calculate the hash of a db object
  // TODO: modularize the db interaction so that this could work with other db types
  async calculateHash(collectionName, docId) {
    let entangledObject = {};
    switch (collectionName) {
      case 'RFQs':
        let rfqUtils = await new RFQutils(this);
        await rfqUtils.addListener();
        entangledObject = await rfqUtils.model.findOne({ _id: docId });
        rfqUtils = null; // Done with this class instance so get rid of it
        break;
      default:
        console.error('Did not find requested data object for entanglement:', collectionName);
    }
    // Apparently there are hidden fields returned by Mongo (?) so have to specify 'entangledObject._doc'
    // Otherwise hash() throws an error
    let result = await hash(entangledObject._doc, { algorithm: 'sha256' });
    return result;
  }
}

module.exports = EntanglementUtils;