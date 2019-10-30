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
    var rfqID = randomstring.generate({
      length: 60,
      charset: 'alphanumeric',
      capitalization: 'lowercase'
    });
    // TODO: If no ids in Mongo, throw error
    let newRFQ = await this.model.create(
      {
        _id: rfqID,
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
    await RFQSchema.post('updateOne', async function (rfqDoc) {
      // Check if this RFQ has an Entanglement
      let entangledDoc = await this.entangleUtils.getSingleEntanglement({ databaseCollection: 'RFQs', databaseLocation: rfqDoc._id });
      if (entangledDoc) {
        console.info('Found Entanglement for RFQ. Updating now...');
        // Update hash in Entanglement and send a message to each participant
        await this.entangleUtils.selfUpdateEntanglement(entangledDoc._id, rfqDoc);
      }
    })
    this.model = mongoose.model('RFQs', RFQSchema);
  }

}

const rfqUtils = new RFQutils();

module.exports = rfqUtils;