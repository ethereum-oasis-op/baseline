/* eslint no-param-reassign: ["error", { "props": false }] */

import { Agreement, getAgreementById, getAllAgreements, getAgreementsByName, saveAgreement, getAgreementsByPrevId } from '../services/agreement';
import { getPartnerByAddress, getPartnerByzkpPublicKey, getPartnerByMessengerKey } from '../services/partner';
import { saveNotice } from '../services/notice';
import { getServerSettings } from '../utils/serverSettings';
import { pubsub } from '../subscriptions';
import msgDeliveryQueue from '../queues/message_delivery';
import { strip0x } from '../utils/crypto/conversions';
import { checkKeyPair } from '../utils/crypto/ecc/babyjubjub-ecc';

const pycryptojs = require('zokrates-pycryptojs');

const NEW_AGREEMENT = 'NEW_AGREEMENT';

const getSignatureStatus = agreement => {
  const { R: RSender, S: SSender } = agreement.constants.EdDSASignatures.sender;
  const { R: RRecipient, S: SRecipient } = agreement.constants.EdDSASignatures.recipient;
  let senderSignatureStatus;
  let recipientSignatureStatus;
  if (RSender && SSender) senderSignatureStatus = true;
  else senderSignatureStatus = false;
  if (RRecipient && SRecipient) recipientSignatureStatus = true;
  else recipientSignatureStatus = false;
  return {
    senderSignatureStatus,
    recipientSignatureStatus,
  };
};

const mapAgreementsWithSignatureStatus = async agreements => {
  const agreementsWithSignatureStatus = await Promise.all(agreements.map(async agreement => {
    const { constants, ...agreementData } = agreement;
    const { senderSignatureStatus, recipientSignatureStatus } = getSignatureStatus(agreement);
    const recipient = await getPartnerByzkpPublicKey(constants.zkpPublicKeyOfRecipient);
    return {
      ...agreementData,
      ...constants,
      whisperPublicKeyRecipient: recipient.identity,
      recipientDetails: recipient,
      senderSignatureStatus,
      recipientSignatureStatus,
    };
  }));
  return agreementsWithSignatureStatus
}

export default {
  Query: {
    agreement: async (_parent, args) => {
      const agreement = await getAgreementById(args.id).then(res => res);
      const { constants, ...agreementData } = agreement;
      const { senderSignatureStatus, recipientSignatureStatus } = getSignatureStatus(agreement);
      const recipient = await getPartnerByzkpPublicKey(constants.zkpPublicKeyOfRecipient);

      return {
        ...agreementData,
        ...constants,
        whisperPublicKeyRecipient: recipient.identity,
        recipientDetails: recipient,
        senderSignatureStatus,
        recipientSignatureStatus,
      };
    },
    agreements: async (_parent, args, context) => {
      const requester = await getPartnerByMessengerKey(context.identity);
      const agreements = await getAllAgreements(requester);
      return mapAgreementsWithSignatureStatus(agreements);
    },
    agreementsByName: async (_parent, args)  => {
      const agreements = await getAgreementsBySKU(args.name);
      return mapAgreementsWithSignatureStatus(agreements);
    },
    agreementsByPrevId: async (_parent, args) => {
      const agreements = await getAgreementsByPrevId(args.prevId);
      return mapAgreementsWithSignatureStatus(agreements);
    }
  },
  Mutation: {
    createAgreement: async (_parent, args, context) => {
      console.log('\n\n\nRequest to create Agreement with inputs:');
      console.log(args.input);
      const _recipient = await getPartnerByAddress(args.input.recipientAddress);
      delete _recipient._id;
      delete args.input.recipientAddress;

      const settings = await getServerSettings();
      const { zkpPrivateKey, zkpPublicKey, name } = settings.organization;
      // Check the zkp key pair (throws an error if invalid pair):
      checkKeyPair(zkpPrivateKey, zkpPublicKey);

      const agreement = new Agreement({
        constants: {
          zkpPublicKeyOfSender: zkpPublicKey,
          zkpPublicKeyOfRecipient: _recipient.zkpPublicKey,
          ...args.input,
        },
      });
      const signature = await pycryptojs.sign(
        strip0x(zkpPrivateKey),
        strip0x(agreement.commitment.commitment.hex()),
      );
      agreement.EdDSASignatures = {
        sender: {
          R: signature[0],
          S: signature[1],
        },
        recipient: {
          R: undefined,
          S: undefined,
        },
      };

      const agreementObject = agreement.object;
      agreementObject.prevId = args.input.prevId;

      const agreementDoc = await saveAgreement(agreementObject);

      await saveNotice({
        resolved: false,
        category: 'agreement',
        subject: `New Agreement: for name ${agreementObject.constants.name}`,
        from: name,
        statusText: 'Pending',
        status: 'outgoing',
        categoryId: agreementDoc._id,
        lastModified: Math.floor(Date.now() / 1000),
      });

      console.log(`\nSending Agreement (id: ${agreementDoc._id}) to Recipient for signing...`);
      msgDeliveryQueue.add({
        documentId: agreementDoc._id,
        senderId: context.identity,
        recipientId: _recipient.identity,
        payload: {
          type: 'agreement_create',
          ...agreementDoc,
        },
      });

      const { constants, ...agreementData } = agreementObject;
      const agreementDetails = {
        _id: agreementDoc._id,
        ...agreementData,
        ...constants,
        recipient: { ..._recipient },
        whisperPublicKeyRecipient: _recipient.identity,
        senderSignatureStatus: true,
        recipientSignatureStatus: false,
      };

      pubsub.publish(NEW_AGREEMENT, { newAgreement: agreementDetails });

      return agreementDetails;
    },
  },
  Subscription: {
    newAgreement: {
      subscribe: () => {
        return pubsub.asyncIterator(NEW_AGREEMENT);
      },
    },
  },
};
