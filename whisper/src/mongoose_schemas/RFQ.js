'use strict';

const mongoose = require('mongoose');

const RFQSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      lowercase: true,
      trim: true,
    },
    // Link to business object (RFQ, PO, invoice, etc.) in user's db
    sku: String,
    quantity: String,
    description: String,
    deliveryDate: String,
    buyerId: String,
    supplierId: String,
    lastUpdated: String,
    created: String
  },
  {
    collection: "RFQs",
    versionKey: false,
  });

module.exports = RFQSchema;
