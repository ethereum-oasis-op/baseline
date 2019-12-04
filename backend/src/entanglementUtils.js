const hash = require('object-hash');
const randomstring = require("randomstring");
const Identity = require('./mongoose_models/Identity');
const Entanglement = require('./mongoose_models/Entanglement');
const rfpUtils = customRequire('src/RFPUtils');

class EntanglementUtils {
  constructor(messengerInstance) {
    this.messenger = messengerInstance;
  }

  async createEntanglement(doc) {
    let exists = await Entanglement.exists({ databaseLocation: doc.databaseLocation });
    console.log('existingEntanglement:', exists);
    if (exists) {
      throw new Error('Entanglement for the database object already exists.');
    }
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
      databaseLocation: doc.databaseLocation,
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

  // Return the state of an entanglement ['pending', 'consistent', 'inconsistent']
  async getState(query) {
    let doc = await Entanglement.findOne(query);
    let hashes = [];
    let state = 'consistent';
    // If any participant has not accepted, set state to 'pending'
    await doc.participants.forEach(({ acceptedRequest, dataHash }) => {
      if (!acceptedRequest) {
        state = 'pending';
        return;
      }
      hashes.push(dataHash);
    });
    if (state === 'pending') return state;
    // If all dataHashes are not equal, set state to 'inconsistent'
    await hashes.forEach(hash => {
      if (hash != hashes[0]) {
        state = 'inconsistent';
        return;
      }
    })
    return state;
  }

  // Update a single Entanglement (initiated by partner message)
  async updateEntanglement(senderId, messageObj) {
    let result = await Entanglement.findOne({ _id: messageObj._id });
    // Verify sender of message is a participant in the Entanglement before allowing the update
    let index = result.participants.findIndex(({ messengerId }) => messengerId === senderId);
    if (index < 0) {
      console.error(`Cannot update Entanglement. Invalid messengerId (${senderId}) trying to make update.`);
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
    entanglementDoc.participants.forEach(async ({ messengerId, isSelf }) => {
      // Don't send message to self
      if (!isSelf) {
        await this.messenger.sendPrivateMessage(myMessengerId, messengerId, undefined, JSON.stringify(entangleMessage));
      }
    });
    return updated;
  }

  // Set acceptedRequest for my messengerId to 'true'
  //    messengerId: 0x... (required)
  //    databaseLocation: { collection, objectId } (optional)
  async acceptEntanglement(entanglementId, doc) {
    if (!doc.messengerId) {
      let foundId = await Identity.findOne({});
      console.log('foundId:', foundId);
      doc.messengerId = foundId.publicKey;
    }
    let entangleObject = await Entanglement.findOne({ _id: entanglementId });
    // If user doesn't supply their databaseLocation, assume the same location as sent in the request
    if (!doc.databaseLocation) {
      doc.databaseLocation = entangleObject.databaseLocation;
    }
    let userIndex = await entangleObject.participants.findIndex(({ messengerId }) => messengerId === doc.messengerId);
    entangleObject.participants[userIndex].acceptedRequest = true;
    entangleObject.participants[userIndex].isSelf = true;

    let time = await Math.floor(Date.now() / 1000);
    let hash = await this.calculateHash(doc.databaseLocation.collection, doc.databaseLocation.objectId);
    entangleObject.participants[userIndex].dataHash = hash;
    entangleObject.participants[userIndex].lastUpdated = time;

    let result = await Entanglement.findOneAndUpdate(
      { _id: entanglementId },
      {
        databaseLocation: doc.databaseLocation,
        participants: entangleObject.participants
      },
      { new: true }
    );

    // Create Entanglement accept object to send as Whisper private message
    let entangleMessage = {
      _id: entanglementId,
      type: 'entanglement_accept',
      participants: entangleObject.participants
    };

    // Send a private message to each participant inviting them to the entanglement channel
    entangleObject.participants.forEach(async ({ messengerId, isSelf }) => {
      // Don't send message to self
      if (!isSelf) {
        await this.messenger.sendPrivateMessage(doc.messengerId, messengerId, undefined, JSON.stringify(entangleMessage));
      }
    });
    return result;
  }

  // Calculate the hash of a db object
  // TODO: modularize the db interaction so that this could work with other db types
  async calculateHash(collectionName, docId) {
    let entangledObject;
    switch (collectionName) {
      case 'RFPs':
        entangledObject = await rfpUtils.model.findOne({ _id: docId });
        break;
      default:
        console.error('Did not find requested database collection for entanglement:', collectionName);
    }
    // Apparently there are hidden fields returned by Mongo (?) so have to specify 'entangledObject._doc'
    // Otherwise hash() throws an error
    delete entangledObject._doc.lastUpdated;  // Do not include lastUpdated timestamp in hash bc it will always vary between participants
    delete entangledObject._doc._id;  // Do not include lastUpdated timestamp in hash bc it will always vary between participants
    let result = await hash(entangledObject._doc, { algorithm: 'sha256' });
    return result;
  }
}

module.exports = EntanglementUtils;