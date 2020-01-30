<<<<<<< HEAD
/* eslint no-param-reassign: ["error", { "props": false }] */

import { MSA, getMSAById, getAllMSAs, getMSABySKU, saveMSA } from '../services/msa';
import { getPartnerByAddress } from '../services/partner';
import { saveNotice } from '../services/notice';
import { getServerSettings } from '../utils/serverSettings';
import { pubsub } from '../subscriptions';
import msgDeliveryQueue from '../queues/message_delivery';
import { strip0x } from '../utils/crypto/conversions';
import { checkKeyPair } from '../utils/crypto/ecc/babyjubjub-ecc';

const pycryptojs = require('zokrates-pycryptojs');
=======
import { uuid } from 'uuidv4';
import {
  getMSAById,
  getAllMSAs,
  getMSAByProposalId,
  saveMSA,
  getMSAsByRFP,
} from '../services/msa';
import { pubsub } from '../subscriptions';
import { saveNotice } from '../services/notice';
import { getPartnerByIdentity } from '../services/partner';
import msgDeliveryQueue from '../queues/message_delivery';
>>>>>>> feat: msa/contract creation integration

const NEW_MSA = 'NEW_MSA';

const getSignatureStatus = msa => {
  const { RBuyer, SBuyer } = msa.constants.EdDSASignatures.buyer;
  const { RSupplier, SSupplier } = msa.constants.EdDSASignatures.supplier;
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

export default {
  Query: {
    msa(_parent, args) {
      const msa = getMSAById(args.id).then(res => res);
      const { buyerSignatureStatus, supplierSignatureStatus } = getSignatureStatus(msa);
      return {
        ...msa,
        buyerSignatureStatus,
        supplierSignatureStatus,
      };
    },
    msas() {
      const msas = getAllMSAs();
      const msasSignatureStatus = msas.map(msa => {
        const { buyerSignatureStatus, supplierSignatureStatus } = getSignatureStatus(msa);
        // eslint-disable-next-line no-param-reassign
        msa = {
          ...msa,
          buyerSignatureStatus,
          supplierSignatureStatus,
        };
        return msa;
      });
      return msasSignatureStatus;
    },
    msaBySKU(_parent, args) {
      const msa = getMSABySKU(args.sku);
      const { buyerSignatureStatus, supplierSignatureStatus } = getSignatureStatus(msa);
      return {
        ...msa,
        buyerSignatureStatus,
        supplierSignatureStatus,
      };
    },
    msasByRFP(_parent, args) {
      return getMSAsByRFP(args.rfpId).then(res => res);
    }
  },
  Mutation: {
    createMSA: async (_parent, args, context) => {
      console.log('\n\n\nRequest to create MSA with inputs:');
      console.log(args.input);
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

      console.log(`\nSending MSA (id: ${msaDoc._id}) to supplier for signing...`);
      msgDeliveryQueue.add({
        documentId: msaDoc._id,
        senderId: context.identity,
        recipientId: _supplier.identity,
        payload: {
          type: 'msa_create',
          ...msaDoc,
        },
      });

      pubsub.publish(NEW_MSA, { newMSA: msaDoc });

      return {
        _id: msaDoc._id,
        ...msaObject.constants,
        supplier: { ..._supplier },
        ...msaObject.commitments[0],
        whisperPublicKeySupplier: _supplier.identity,
        buyerSignatureStatus: true,
        supplierSignatureStatus: false,
      };
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
