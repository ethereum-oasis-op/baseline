const hash = require('object-hash');

class RFQutils {
  constructor(db) {
    this.db = db;
    this.rfqs = db.collection('RFQs');
  }

  // Get all Entanglement objects for the given user
  // Get all Entanglements if no user is provided
  async createRFQ(doc) {
    let time = await new Date();
    // If buyerId not provided, use first id stored in Mongo
    let buyerId = doc.buyerId;
    if (!buyerId) {
      buyerId = await this.db.collection('Identities').findOne({});
      buyerId = buyerId._id
    }
    // TODO: If no ids in Mongo, throw error
    let newRFQ = await this.rfqs.insertOne(
      {
        sku: doc.sku,
        quantity: doc.quantity,
        description: doc.description || '',
        deliveryDate: doc.deliveryDate,
        buyerId: buyerId || '',
        supplierId: doc.supplierId || '',
        created: time,
        updated: time
      }
    );
    return newRFQ.value;
  }

  // Get all Entanglement objects for the given user
  async getSingleRFQ(rfqId) {
    let result = await this.rfqs.findOne({ _id: rfqId });
    return result;
  }

  // Get all Entanglement objects for the given user
  async getAllRFQs() {
    let result = await this.rfqs.find({}).toArray();
    return result;
  }

}

module.exports = RFQutils;