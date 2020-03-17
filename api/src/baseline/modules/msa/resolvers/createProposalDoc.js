import { saveProposal } from '../../../../db/models/modules/msa/proposals';
import { setDocTypeForBaselineTaskGroup } from '../../../../db/models/baseline/baselineTaskGroup';

const createProposalDoc = async params => {
  const { baselineId } = params;
  const proposal = await saveProposal(params);
  await setDocTypeForBaselineTaskGroup(baselineId, 'proposal', proposal._id);
  return {
    proposalId: proposal._id,
    createdDate: proposal.createdDate,
  };
};

export default createProposalDoc;
