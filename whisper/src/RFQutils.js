const mongoose = require('mongoose');
const randomstring = require("randomstring");
const RFQSchema = require('./mongoose_schemas/RFQ');
const Identity = require('./mongoose_models/Identity');

class RFQutils {
  //constructor(entangleUtilsInstance) {
  //if (!RFQutils.instance) {
  //this.entangleUtils = entangleUtilsInstance;
  //RFQutils.instance = this;
  //}
  //return RFQutils.instance;
  //}

  constructor() {
    if (!RFQutils.instance) {
      RFQutils.instance = this;
    }
    return RFQutils.instance;
  }

  async addEntangleUtils(entangleUtilsInstance) {
    this.entangleUtils = entangleUtilsInstance;
  }

  async createRFQ(doc) {
    let time = await Math.floor(Date.now() / 1000);
    // If buyerId not provided, use first id stored in Mongo
    let buyerId = doc.buyerId;
    if (!buyerId) {
      buyerId = await Identity.findOne({});
      buyerId = buyerId._id
    }
    // Generate _id if this is a new rfq that doesn't have _id yet
    if (!doc._id) {
      doc._id = randomstring.generate({
        length: 60,
        charset: 'alphanumeric',
        capitalization: 'lowercase'
      });
    }
    // TODO: If no ids in Mongo, throw error
    let newRFQ = await this.model.create(
      {
        _id: doc._id,
        sku: doc.sku,
        quantity: doc.quantity,
        description: doc.description || '',
        deliveryDate: doc.deliveryDate,
        buyerId: buyerId,
        supplierId: doc.supplierId,
        created: doc.created || time,
        updated: doc.updated || time
      }
    );
    return newRFQ;
  }

  async updateRFQ(rfqId, doc) {
    let time = await Math.floor(Date.now() / 1000);
    let oldRFQ = await this.model.findOne({ _id: rfqId });
    console.log('rfq doc:', doc);
    let newRFQ = {
      sku: doc.sku || oldRFQ.sku,
      quantity: doc.quantity || oldRFQ.quantity,
      description: doc.description || oldRFQ.description,
      deliveryDate: doc.deliveryDate || oldRFQ.deliveryDate,
      updated: time
    }
    let result = await this.model.findOneAndUpdate(
      { _id: oldRFQ._id },
      newRFQ,
      { new: true }
    );
    return result
  }

  // Get one RFQ
  async getSingleRFQ(rfqId) {
    let result = await this.model.findOne({ _id: rfqId });
    return result;
  }

  // Get all RFQs
  async getAllRFQs() {
    let result = await this.model.find({});
    return result;
  }

  async addListener() {
    // If user updates their own RFQ instance, alert other Entangled parties
    let that = this;
    await RFQSchema.post('updateOne', async function () {
      // Check if this RFQ has an Entanglement
      let entangledDoc = await that.entangleUtils.getSingleEntanglement({ databaseLocation: { collection: 'RFQs', objectId: this._conditions._id } });
      if (entangledDoc) {
        console.info('Found Entanglement for RFQ. Updating now...');
        // Update hash in Entanglement and send a message to each participant
        await that.entangleUtils.selfUpdateEntanglement(entangledDoc, 'RFQs', this._conditions._id);
      }
    })
    await RFQSchema.post('findOneAndUpdate', async function () {
      // Check if this RFQ has an Entanglement
      let entangledDoc = await that.entangleUtils.getSingleEntanglement({ databaseLocation: { collection: 'RFQs', objectId: this._conditions._id } });
      if (entangledDoc) {
        console.info('Found Entanglement for RFQ. Updating now...');
        // Update hash in Entanglement and send a message to each participant
        await that.entangleUtils.selfUpdateEntanglement(entangledDoc, 'RFQs', this._conditions._id);
      }
    })
    this.model = mongoose.model('RFQs', RFQSchema);
  }

}

const rfqUtils = new RFQutils();

module.exports = rfqUtils;