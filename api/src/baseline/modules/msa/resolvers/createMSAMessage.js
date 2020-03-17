import { getMSAById } from '../../../../db/models/modules/msa';
import { getOrganizationServerSetting } from '../../../../db/models/baseline/server/settings';

const createMSAMessages = async params => {
  console.log('Creating Proposal Messages ...');
  const { msaId } = params;
  const msa = await getMSAById(msaId);
  const orgIdentity = await getOrganizationServerSetting('messengerKey');
  const { recipients, ...data } = msa;
  const MSAMessages = [];

  recipients.forEach(recipient => {
    console.log(`Preparing MSA Message (uuid: ${msaId}) to recipient ${recipient}...`);
    const message = {
      documentId: msaId,
      senderId: orgIdentity,
      recipientId: recipient,
      payload: {
        ...data,
        type: 'msa_create',
        uuid: msaId,
        recipients: [recipient],
      },
    };
    MSAMessages.push(message);
  });

  return {
    MSAMessages,
  };
};

export default createMSAMessages;
