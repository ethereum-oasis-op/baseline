import db from '../db';

export const getPartnerByzkpPublicKey = async zkpPublicKey => {
  const partner = await db
    .collection('organization')
    .findOne({ zkpPublicKey });
  return partner;
};

export const getPartnerByAddress = async address => {
  const partner = await db.collection('organization').findOne({ address });
  return partner;
};

export const getPartnerByMessengerKey = async messengerKey => {
  const partner = await db.collection('organization').findOne({ identity: messengerKey });
  return partner;
};

export const getAllPartners = async () => {
  const organizations = await db
    .collection('organization')
    .find({})
    .toArray();
  return organizations;
};

export const getMyPartners = async () => {
  const partners = await db
    .collection('partner')
    .find({})
    .toArray();
  return partners;
};

export const savePartner = async input => {
  const { address } = input;
  const partner = await db
    .collection('partner')
    .updateOne({ _id: address }, { $set: input }, { upsert: true });
  return partner;
};

export const deletePartner = async input => {
  const { address } = input;
  const partner = await db.collection('partner').deleteOne({ _id: address });
  return partner;
};
