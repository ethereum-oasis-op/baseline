import db from '../db';

export const getMSAById = async id => {
  const msa = await db.collection('msa').findOne({ _id: id });
  return msa;
};

export const getMSAByProposalId = async id => {
  const msa = await db.collection('msa').findOne({ proposalId: id });
  return msa;
}

export const getAllMSAs = async () => {
  const msas = await db
    .collection('msa')
    .find({})
    .toArray();
  return msas;
};

export const saveMSA = async input => {
  const exists = await getMSAByProposalId(input.proposalId);
  if (exists) throw new Error(`MSA already exists for Proposal ${input.proposalId}`);
  const count = await db.collection('msa').count({});
  const doc = Object.assign(input, { _id: count + 1 });
  const msa = await db.collection('msa').insert(doc);
  return msa;
};
