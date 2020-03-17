import mongoose from 'mongoose';
import { uuid } from 'uuidv4';

const MSASchema = new mongoose.Schema({
  _id: String,
  proposalId: String,
  rfpId: String,
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

const MSA = mongoose.model('msa', MSASchema);

export const getMSAById = async id => {
  const msa = await MSA.findOne({ _id: id });
  return msa;
};

export const getMSAByProposalId = async id => {
  const msa = await MSA.findOne({ proposalId: id });
  return msa;
};

export const getAllMSAs = async () => {
  const msas = await MSA.find({});
  return msas;
};

export const saveMSA = async input => {
  const exists = await getMSAByProposalId(input.proposalId);
  if (exists) throw new Error(`MSA already exists for Proposal ${input.proposalId}`);
  const msa = new MSA({ _id: uuid(), ...input });
  await msa.save();
  return msa;
};

export default {
  getMSAById,
  getMSAByProposalId,
  getAllMSAs,
  saveMSA,
};
