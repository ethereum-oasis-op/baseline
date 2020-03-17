import { getRFPById } from '../../../../db/models/modules/msa/rfps';
import { getOrganizationServerSetting } from '../../../../db/models/baseline/server/settings';

const createRFPMessages = async params => {
  console.log('Creating RFP Messages ...');
  const { rfpId } = params;
  const rfp = await getRFPById(rfpId);
  const orgIdentity = await getOrganizationServerSetting('messengerKey');
  const { recipients, ...data } = rfp;
  const rfpMessages = [];

  recipients.forEach(recipient => {
    console.log(`Preparing RFP Message (uuid: ${rfpId}) to recipient ${recipient}...`);
    const message = {
      documentId: rfpId,
      docType: 'rfp',
      senderId: orgIdentity,
      recipientId: recipient,
      payload: {
        ...data,
        uuid: rfpId,
        type: 'rfp_create',
        recipients: [recipient],
      },
    };
    rfpMessages.push(message);
  });

  console.log('Done creating messages');
  return {
    rfpMessages,
  };
};

export default createRFPMessages;
