import mongoose from 'mongoose';

/**
 * Notes:
 */

const OrganizationsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  role: {
    type: Number,
    required: true,
  },
  identity: {
    type: String,
    required: true,
  },
  partner: {
    type: Boolean,
    required: true,
  },
});

const Organization = mongoose.model('organizations', OrganizationsSchema);

// Organization
export const getOrganizationById = async address => {
  const organization = await Organization.findOne({ _id: address });
  return organization;
};

export const getAllOrganizations = async () => {
  const organizations = await Organization.find({}).toArray();
  return organizations;
};

export const saveOrganization = async input => {
  const organization = await Organization.updateOne(
    { _id: input.address },
    { $set: input },
    { upsert: true },
  );
  return organization;
};

// Partner
export const getPartnerById = async address => {
  const partner = await Organization.find({ _id: address, partner: true });
  return partner;
};

export const getPartnerByIdentity = async identity => {
  const partner = await Organization.findOne({ sender: identity });
  return partner;
};

export const getAllPartners = async () => {
  const partners = await Organization.find({ partner: true }).toArray();
  return partners;
};

export const setPartner = async (input, state = true) => {
  const { address } = input;
  const partner = await Organization.updateOne(
    { _id: address, partner: state },
    { $set: input },
    { upsert: true },
  );
  return partner;
};

export default {
  getPartnerById,
  getPartnerByIdentity,
  getAllPartners,
  setPartner,
  getOrganizationById,
  getAllOrganizations,
  saveOrganization,
};
