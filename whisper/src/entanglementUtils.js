const hash = require('object-hash');
const randomstring = require("randomstring");

class EntanglementUtils {
  constructor(db, messengerInstance) {
    this.db = db;
    this.entanglements = db.collection('Entanglements');
    this.messenger = messengerInstance;
  }

  async createEntanglement(doc) {
    var entangleID = randomstring.generate({
      length: 60,
      charset: 'alphanumeric',
      capitalization: 'lowercase'
    });
    let time = await new Date();
    let hash = await this.calculateHash(doc.databaseLocation.collection, doc.databaseLocation.objectId);
    // TODO deploy Consistency smart contract and initiate dataHash
    // Store hash in contract under my Eth address for this dataId

    // If whisperId not provided, default to first whisperId in Identities collection
    let myId = doc.whisperId;
    if (!myId) {
      myId = this.db.collection('Identities').findOne({});
    }
    // Add self as a participant, then add rest of participants listed in req.body
    let participants = [{ messengerId: myId, acceptedRequest: true, dataHash: hash, lastUpdated: time }];
    doc.partnerIds.forEach(whisperId => {
      participants.push({ messengerId: whisperId, acceptedRequest: false });
    });
    let result = await this.entanglements.findOneAndUpdate(
      { _id: entangleID },
      {
        $set: {
          _id: entangleID,
          databaseLocation: {
            collection: doc.databaseLocation.collection,
            objectId: doc.databaseLocation.objectId
          },
          participants: participants,
          blockchain: doc.blockchain,
          created: time
        }
      },
      { upsert: true, returnOriginal: false }
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
      await this.messenger.sendPrivateMessage(doc.whisperId, partnerId, undefined, JSON.stringify(entangleRequest));
    });
    return result;
  }

  // Get all Entanglement objects for the given user
  // Get all Entanglements if no user is provided
  async getEntanglements(userId) {
    let result;
    if (userId) {
      result = await this.entanglements.find({ 'participants.messengerId': userId }).toArray();
    } else {
      result = await this.entanglements.find({}).toArray();
    }
    return result;
  }

  // Get all Entanglement objects for the given user
  async getSingleEntanglement(entanglementId) {
    let result = await this.entanglements.findOne({ _id: entanglementId });
    return result;
  }

  // Update a single Entanglement (initiated by partner)
  async updateEntanglement(data, messageObj) {
    let result = await this.entanglements.findOne({ _id: messageObj._id });
    // Verify sender of message is a participant in the Entanglement before allowing the update
    let index = result.participants.findIndex(({ messengerId }) => messengerId === data.sig);
    if (index < 0) {
      console.error("Cannot update Entanglement. Invalid messengerId trying to make update.");
      return;
    }
    let time = await new Date();
    result.participants[index].dataHash = messageObj.dataHash;
    result.participants[index].lastUpdated = time;
    let updated = await this.entanglements.findOneAndUpdate(
      { _id: messageObj._id },
      {
        $set: {
          participants: result.participants,
        }
      },
      { returnOriginal: false }
    );
    return updated.value;
  }

  //  Update Entanglement dataField object
  //    dataField: {
  //      value: String,
  //      dataId: String,
  //      description: String
  //    },
  //    messengerId: 0x... (required)
  async updateEntanglement(entanglementId, doc) {
    let time = await new Date();
    let entangleObject = await this.db.collection('Entanglements').findOne({ _id: entanglementId });
    let result = await this.db.collection('Entanglements').findOneAndUpdate(
      { _id: entanglementId },
      {
        $set: {
          "dataField.value": doc.dataField.value || entangleObject.dataField.value,
          "dataField.description": doc.dataField.description || entangleObject.dataField.description,
          lastUpdated: time
        }
      },
      { returnOriginal: false }
    );

    // Create Entanglement update object to send as Whisper private message
    let entangleMessage = {
      _id: entanglementId,
      type: 'entanglement_update',
      dataField: result.value.dataField,
      lastUpdated: time
    };

    // TODO: should we send one public message or a separate private message for each participant?
    //     - Probably public so everyone can see the acks? Would have to assume all parties
    //       parties are subscribed to the public channel
    // Send a private message to each participant inviting them to the entanglement channel
    entangleObject.participants.forEach(async ({ messengerId }) => {
      // Don't send message to self
      if (messengerId !== doc.whisperId) {
        await this.sendPrivateMessage(doc.whisperId, messengerId, undefined, JSON.stringify(entangleMessage));
      }
    });
    return result;
  }

  // Set acceptedRequest for my whisperId to 'true'
  //    messengerId: 0x... (required)
  //    acceptedRequest: Boolean (optional)
  async acceptEntanglement(entanglementId, doc) {
    let time = await new Date();
    let entangleObject = await this.db.collection('Entanglements').findOne({ _id: entanglementId });
    let userIndex = await entangleObject.participants.findIndex(({ messengerId }) => messengerId === doc.whisperId);
    entangleObject.participants[userIndex].acceptedRequest = true;
    let result = await this.db.collection('Entanglements').findOneAndUpdate(
      { _id: entanglementId },
      {
        $set: {
          participants: entangleObject.participants,
          lastUpdated: time
        }
      },
      { returnOriginal: false }
    );

    // Create Entanglement accept object to send as Whisper private message
    let entangleMessage = {
      _id: entanglementId,
      type: 'entanglement_accept',
      lastUpdated: time
    };

    // Send a private message to each participant inviting them to the entanglement channel
    entangleObject.participants.forEach(async ({ messengerId }) => {
      // Don't send message to self
      if (messengerId !== doc.whisperId) {
        await this.sendPrivateMessage(doc.whisperId, messengerId, undefined, JSON.stringify(entangleMessage));
      }
    });
    return result.value;
  }

  // Calculate the hash of a db object
  // TODO: modularize the db interaction so that this could work with other db types
  async calculateHash(collectionName, docId) {
    let collection = await this.db.collection(collectionName);
    let entangled = await collection.findOne({ _id: docId });
    let result = await hash(entangled, { algorithm: 'sha256' });
    return result;
  }
}

module.exports = EntanglementUtils;