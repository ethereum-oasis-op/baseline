import mongoose from 'mongoose';

const agreementSchema = new mongoose.Schema({
  _id: String,
  linkedId: String,
  buyerSignature: {
    name: String,
    signature: String,
    signatureDate: Number,
  },
  supplierSignature: {
    name: String,
    signature: String,
    signatureDate: Number,
  },
  lastModified: Number,
  createdDate: Number,
});

const Agreement = mongoose.model('agreement', agreementSchema);

export const getAgreementById = async id => {
  const doc = await Agreement.findOne({ _id: id });
  return doc;
};

export const getAgreementByLinkedId = async id => {
  const doc = await Agreement.findOne({ linkedId: id });
  return doc;
};

export const getAllAgreements = async () => {
  const Agreements = await Agreement.find({}).toArray();
  return Agreements;
};

export const saveAgreement = async input => {
  const exists = await getAgreementByLinkedId(input.linkedId);
  if (exists) throw new Error(`Agreement already exists for the linked ID ${input.linkedId}`);
  const agreement = new Agreement({ _id: uuid(), ...input });
  await agreement.save();
  return agreement;
};

export default {
  getAgreementById,
  getAgreementByLinkedId,
  getAllAgreements,
  saveAgreement,
};
