const randomstring = require("randomstring");
const RFP = require('./mongoose_models/RFP');
const Identity = require('./mongoose_models/Identity');

class RFPutils {

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
    let newRFP = await RFP.create(
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
    let oldRFP = await RFP.findOne({ uuid: rfpId }).lean();
    let newRFP = {
      name: doc.name || oldRFP.name,
      item: doc.item || oldRFP.item,
      estimatedQty: doc.estimatedQty || oldRFP.estimatedQty,
      updated: time
    };

    let result = await RFP.findOneAndUpdate(
      { uuid: rfpId },
      newRFP,
      { new: true }
    );
    return result
  }

  // Get one RFP
  async getSingleRFP(rfpId) {
    let result = await RFP.findOne({ uuid: rfpId });
    return result;
  }

  // Get all RFPs
  async getAllRFPs() {
    let result = await RFP.find({});
    return result;
  }

}

module.exports = RFPutils;