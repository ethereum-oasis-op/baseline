/* eslint no-param-reassign: ["error", { "props": false }] */

import { MSA, getMSAById, getAllMSAs, getMSAsBySKU, saveMSA, getMSAsByRFPId } from '../../services/msa';
import { getPartnerByAddress, getPartnerByzkpPublicKey, getPartnerByMessagingKey } from '../../services/partner';
import { saveNotice } from '../../services/notice';
import { getServerSettings } from '../../utils/serverSettings';
import { pubsub } from '../subscriptions';
import msgDeliveryQueue from '../../queues/message_delivery';
import { strip0x } from '../../utils/crypto/conversions';
import { checkKeyPair } from '../../utils/crypto/ecc/babyjubjub-ecc';

const pycryptojs = require('zokrates-pycryptojs');

import { logger } from 'radish34-logger';

const NEW_MSA = 'NEW_MSA';

const getSignatureStatus = msa => {
  const { R: RBuyer, S: SBuyer } = msa.constants.EdDSASignatures.buyer;
  const { R: RSupplier, S: SSupplier } = msa.constants.EdDSASignatures.supplier;
  let buyerSignatureStatus;
  let supplierSignatureStatus;
  if (RBuyer && SBuyer) buyerSignatureStatus = true;
  else buyerSignatureStatus = false;
  if (RSupplier && SSupplier) supplierSignatureStatus = true;
  else supplierSignatureStatus = false;
  return {
    buyerSignatureStatus,
    supplierSignatureStatus,
  };
};

const mapMSAsWithSignatureStatus = async msas => {
  const msasWithSignatureStatus = await Promise.all(msas.map(async msa => {
    const { constants, ...msaData } = msa;
    const { buyerSignatureStatus, supplierSignatureStatus } = getSignatureStatus(msa);
    const supplier = await getPartnerByzkpPublicKey(constants.zkpPublicKeyOfSupplier);
    return {
      ...msaData,
      ...constants,
      whisperPublicKeySupplier: supplier.identity,
      supplierDetails: supplier,
      buyerSignatureStatus,
      supplierSignatureStatus,
    };
  }));
  return msasWithSignatureStatus
}

export default {
  Query: {
    msa: async (_parent, args) => {
      const msa = await getMSAById(args.id).then(res => res);
      const { constants, ...msaData } = msa;
      const { buyerSignatureStatus, supplierSignatureStatus } = getSignatureStatus(msa);
      const supplier = await getPartnerByzkpPublicKey(constants.zkpPublicKeyOfSupplier);

      return {
        ...msaData,
        ...constants,
        whisperPublicKeySupplier: supplier.identity,
        supplierDetails: supplier,
        buyerSignatureStatus,
        supplierSignatureStatus,
      };
    },
    msas: async (_parent, args, context) => {
      const requester = await getPartnerByMessagingKey(context.identity);
      const msas = await getAllMSAs(requester);
      return mapMSAsWithSignatureStatus(msas);
    },
    msasBySKU: async (_parent, args) => {
      const msas = await getMSAsBySKU(args.sku);
      return mapMSAsWithSignatureStatus(msas);
    },
    msasByRFPId: async (_parent, args) => {
      const msas = await getMSAsByRFPId(args.rfpId);
      return mapMSAsWithSignatureStatus(msas);
    }
  },
  Mutation: {
    createMSA: async (_parent, args, context) => {
      logger.info(`Request to create MSA with inputs:\n%o`, args.input, { service: 'API' });
      const _supplier = await getPartnerByAddress(args.input.supplierAddress);
      delete _supplier._id;
      delete args.input.supplierAddress;

      const settings = await getServerSettings();
      const { zkpPrivateKey, zkpPublicKey, name } = settings.organization;

      // Check the zkp key pair (throws an error if invalid pair):
      checkKeyPair(zkpPrivateKey, zkpPublicKey);

      const msa = new MSA({
        constants: {
          zkpPublicKeyOfBuyer: zkpPublicKey,
          zkpPublicKeyOfSupplier: _supplier.zkpPublicKey,
          ...args.input,
        },
      });

      const signature = await pycryptojs.sign(
        strip0x(zkpPrivateKey),
        strip0x(msa.commitment.commitment.hex()),
      );

      msa.EdDSASignatures = {
        buyer: {
          R: signature[0],
          S: signature[1],
        },
        supplier: {
          R: undefined,
          S: undefined,
        },
      };

      const msaObject = msa.object;
      msaObject.rfpId = args.input.rfpId;

      const msaDoc = await saveMSA(msaObject);

      await saveNotice({
        resolved: false,
        category: 'msa',
        subject: `New MSA: for SKU ${msaObject.constants.sku}`,
        from: name,
        statusText: 'Pending',
        status: 'outgoing',
        categoryId: msaDoc._id,
        lastModified: Math.floor(Date.now() / 1000),
      });

      logger.info(`Sending MSA with id ${msaDoc._id} to ${_supplier.messagingKey} for signing.`, { service: 'API' });
      msgDeliveryQueue.add(
        {
          documentId: msaDoc._id,
          senderId: context.identity,
          recipientId: _supplier.messagingKey,
          payload: {
            type: 'msa_create',
            ...msaDoc,
          },
        },
        {
          // Mark job as failed after 20sec so subsequent jobs are not stalled
          timeout: 20000,
        },
      );

      const { constants, ...msaData } = msaObject;
      const msaDetails = {
        _id: msaDoc._id,
        ...msaData,
        ...constants,
        supplier: { ..._supplier },
        whisperPublicKeySupplier: _supplier.identity,
        buyerSignatureStatus: true,
        supplierSignatureStatus: false,
      };

      pubsub.publish(NEW_MSA, { newMSA: msaDetails });

      return msaDetails;
    },
  },
  Subscription: {
    newMSA: {
      subscribe: () => {
        return pubsub.asyncIterator(NEW_MSA);
      },
    },
  },
};
