import { getProposalById } from '../../../../db/models/modules/msa/proposals';
import { getRFPById } from '../../../../db/models/modules/msa/rfps';
import { getOrganizationServerSetting } from '../../../../db/models/baseline/server/settings';

const createProposalMessages = async params => {
  console.log('Creating Proposal Messages ...', params);
  const { proposalId } = params;
  const proposal = await getProposalById(proposalId);
  const orgIdentity = await getOrganizationServerSetting('messengerKey');
  const rfp = await getRFPById(proposal.rfpId);

  const message = {
    documentId: proposalId,
    senderId: orgIdentity,
    recipientId: rfp.sender,
    payload: {
      ...proposal,
      type: 'proposal_create',
      uuid: proposalId,
      recipients: [rfp.sender],
    },
  };

  return {
    proposalMessages: [message],
    recipients: [rfp.sender],
  };
};

export default createProposalMessages;
