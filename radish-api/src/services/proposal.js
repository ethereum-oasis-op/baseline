import db from '../db';

export const getProposalById = async id => {
  const proposals = await db.collection('proposals').findOne({ _id: id });
  return proposals;
};

export const getProposalsByRFPId = async rfpId => {
  const proposal = await db
    .collection('proposals')
    .find({ rfpId })
    .toArray();
  return proposal;
};

export const getAllProposals = async () => {
  const proposals = await db
    .collection('proposals')
    .find({})
    .toArray();
  return proposals;
};

export const saveProposal = async input => {
  const proposal = await db.collection('proposals').insert(input);
  return proposal;
};

export const getProposalByRFPAndSupplier = async input => {
  const proposal = await db.collection('proposals').findOne(input);
  return proposal;
};
