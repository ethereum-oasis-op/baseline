import db from '../db';

export const getPartnerByzkpPublicKey = async zkpPublicKey => {
  const partner = await db
    .collection('organization')
    .findOne({ zkpPublicKey: zkpPublicKey });
  return partner;
};

export const getPartnerByAddress = async address => {
  const partner = await db.collection('organization').findOne({ address: address });
  return partner;
};

export const getPartnerByMessagingKey = async messagingKey => {
  const partner = await db.collection('organization').findOne({ messagingKey: messagingKey });
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
  const partner = await db
    .collection('partner')
    .updateOne({ _id: input.address }, { $set: input }, { upsert: true });
  return partner;
};

export const deletePartner = async input => {
  const partner = await db.collection('partner').deleteOne({ _id: input.address });
  return partner;
};
