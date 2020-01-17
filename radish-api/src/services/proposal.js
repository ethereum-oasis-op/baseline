import db from '../db';

export const getProposalById = async id => {
  const proposals = await db.collection('proposal').findOne({ _id: id });
  return proposals;
};

export const getProposalByRFPId = async rfpId => {
  const proposal = await db.collection('proposal').findOne({ rfpId });
  return proposal;
}

export const getAllProposals = async () => {
  const proposals = await db
    .collection('proposal')
    .find({})
    .toArray();
  return proposals;
};

export const saveProposal = async input => {
  const count = await db.collection('proposal').count({});
  const doc = Object.assign(input, { _id: count + 1 });
  const proposal = await db.collection('proposal').insert(doc);
  return proposal;
};
