const mongoose = require('mongoose');
const randomstring = require("randomstring");
const RFPSchema = require('./mongoose_schemas/RFP');
const Identity = require('./mongoose_models/Identity');

class RFPutils {
  constructor() {
    if (!RFPutils.instance) {
      RFPutils.instance = this;
    }
    return RFPutils.instance;
  }

  async addEntangleUtils(entangleUtilsInstance) {
    this.entangleUtils = entangleUtilsInstance;
  }

  async createRFP(doc) {
    let time = await Math.floor(Date.now() / 1000);
    // If buyerId not provided, use first id stored in Mongo
    let buyerId = doc.buyerId;
    if (!buyerId) {
      buyerId = await Identity.findOne({});
      buyerId = buyerId._id
    }
    // Generate uuid if this is a new rfp that doesn't have uuid yet
    if (!doc.uuid) {
      doc.uuid = randomstring.generate({
        length: 60,
        charset: 'alphanumeric',
        capitalization: 'lowercase'
      });
    }
    let newRFP = await this.model.create(
      {
        _id: doc.uuid,
        uuid: doc.uuid,
        name: doc.name || '',
        item: doc.item,
        estimatedQty: doc.estimatedQty,
        buyerId: buyerId,
        recipients: doc.recipients,
        onchainAttrs: doc.onchainAttrs || {},
        zkpAttrs: doc.zkpAttrs || {},
        createdDate: doc.createdDate || time,
        publishDate: doc.publishDate || null,
        closedDate: doc.closedDate || null,
        updated: doc.updated || time
      }
    );
    return newRFP;
  }

  async updateRFP(rfpId, doc) {
    let time = await Math.floor(Date.now() / 1000);
    // lean() option forces Mongoose to return plain javascript object. Without it,
    // a schema-less document makes object's fields look undefined
    let oldRFP = await this.model.findOne({ uuid: rfpId }).lean();
    let newRFP = {
      name: doc.name || oldRFP.name,
      item: doc.item || oldRFP.item,
      estimatedQty: doc.estimatedQty || oldRFP.estimatedQty,
      updated: time
    };

    let result = await this.model.findOneAndUpdate(
      { uuid: rfpId },
      newRFP,
      { new: true }
    );
    return result
  }

  // Get one RFP
  async getSingleRFP(rfpId) {
    let result = await this.model.findOne({ uuid: rfpId });
    return result;
  }

  // Get all RFPs
  async getAllRFPs() {
    let result = await this.model.find({});
    return result;
  }

  //async addListener() {
  //// If user updates their own RFP instance, alert other Entangled parties
  //let that = this;
  //await RFPSchema.post('updateOne', async function (doc) {
  //// Check if this RFP has an Entanglement
  //let entangledDoc = await that.entangleUtils.getSingleEntanglement({ databaseLocation: { collection: 'RFPs', objectId: doc._id } });
  //if (entangledDoc) {
  //console.info('Found Entanglement for RFP. Updating now...');
  //// Update hash in Entanglement and send a message to each participant
  //await that.entangleUtils.selfUpdateEntanglement(entangledDoc, 'RFPs', doc._id);
  //}
  //})
  //await RFPSchema.post('findOneAndUpdate', async function (doc) {
  //// Check if this RFP has an Entanglement
  //let entangledDoc = await that.entangleUtils.getSingleEntanglement({ databaseLocation: { collection: 'RFPs', objectId: doc._id } });
  //if (entangledDoc) {
  //console.info('Found Entanglement for RFP. Updating now...');
  //// Update hash in Entanglement and send a message to each participant
  //await that.entangleUtils.selfUpdateEntanglement(entangledDoc, 'RFPs', doc._id);
  //}
  //})
  //this.model = mongoose.model('RFPs', RFPSchema);
  //}

  async addListener() {
    // If user updates their own RFP instance, alert other Entangled parties
    let that = this;
    await RFPSchema.post('updateOne', async function (doc) {
      // Check if this RFP has an Entanglement
      let entangledDoc = await that.entangleUtils.getSingleEntanglement({ databaseLocation: { collection: 'RFPs', objectId: doc._id } });
      if (entangledDoc) {
        console.info('Found Entanglement for RFP. Updating now...');
        // Update hash in Entanglement and send a message to each participant
        await that.entangleUtils.selfUpdateEntanglement(entangledDoc, 'RFPs', doc._id);
      }
    })
    await RFPSchema.post('findOneAndUpdate', async function (doc) {
      // Check if this RFP has an Entanglement
      let entangledDoc = await that.entangleUtils.getSingleEntanglement({ databaseLocation: { collection: 'RFPs', objectId: doc._id } });
      if (entangledDoc) {
        console.info('Found Entanglement for RFP. Updating now...');
        // Update hash in Entanglement and send a message to each participant
        await that.entangleUtils.selfUpdateEntanglement(entangledDoc, 'RFPs', doc._id);
      }
    })
    this.model = mongoose.model('RFPs', RFPSchema);
  }

}

const rfpUtils = new RFPutils();

module.exports = rfpUtils;