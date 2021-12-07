import db from '../db';

export const getRFPById = async uuid => {
  const rfp = await db.collection('RFPs').findOne({ _id: uuid });
  return rfp;
};

export const getAllRFPs = async () => {
  const rfps = await db
    .collection('RFPs')
    .find({})
    .toArray();
  return rfps;
};
