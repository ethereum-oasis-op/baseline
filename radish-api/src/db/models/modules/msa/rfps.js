import mongoose from 'mongoose';

const RFPSchema = new mongoose.Schema({
  description: String,
  sku: String,
  skuDescription: String,
  recipients: Object,
  sender: String,
  onchainAttrs: Object,
  zkpAttrs: Object,
  proposalDeadline: Number,
  createdDate: Number,
  publishDate: Number,
  closedDate: Number,
});

const RFP = mongoose.model('rfps', RFPSchema);

export const getRFPById = async uuid => {
  const rfp = await RFP.findOne({ _id: uuid });
  return rfp;
};

export const getAllRFPs = async () => {
  const rfps = await RFP.find({}).toArray();
  return rfps;
};

export default {
  getRFPById,
  getAllRFPs,
};
