/* eslint no-param-reassign: ["error", { "props": false }] */

import { MSA, getMSAById, getAllMSAs, getMSAsBySKU, saveMSA, getMSAsByRFPId } from '../services/msa';
import { getPartnerByAddress, getPartnerByzkpPublicKey, getPartnerByMessengerKey } from '../services/partner';
import { saveNotice } from '../services/notice';
import { getServerSettings } from '../utils/serverSettings';
import { pubsub } from '../subscriptions';
import msgDeliveryQueue from '../queues/message_delivery';
import { strip0x } from '../utils/crypto/conversions';
import { checkKeyPair } from '../utils/crypto/ecc/babyjubjub-ecc';

const pycryptojs = require('zokrates-pycryptojs');

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
      const { id } = args;
      const msa = await getMSAById(id).then(res => res);
      const { constants, ...msaData } = msa;
      const { buyerSignatureStatus, supplierSignatureStatus } = getSignatureStatus(msa);
      const supplier = await getPartnerByzkpPublicKey(constants.zkpPublicKeyOfSupplier);
      const { identity } = supplier;
      return {
        ...msaData,
        ...constants,
        whisperPublicKeySupplier: identity,
        supplierDetails: supplier,
        buyerSignatureStatus,
        supplierSignatureStatus,
      };
    },
    msas: async (_parent, args, context) => {
      const { identity } = context;
      const requester = await getPartnerByMessengerKey(identity);
      const msas = await getAllMSAs(requester);
      return mapMSAsWithSignatureStatus(msas);
    },
    msasBySKU: async (_parent, args) => {
      const { sku } = args;
      const msas = await getMSAsBySKU(sku);
      return mapMSAsWithSignatureStatus(msas);
    },
    msasByRFPId: async (_parent, args) => {
      const { rfpId } = args;
      const msas = await getMSAsByRFPId(rfpId);
      return mapMSAsWithSignatureStatus(msas);
    }
  },
  Mutation: {
    createMSA: async (_parent, args, context) => {
      const { input } = args;
      const { supplierAddress } = input;
      console.log('\n\n\nRequest to create MSA with inputs:');
      console.log(input);
      const _supplier = await getPartnerByAddress(supplierAddress);
      delete _supplier._id;
      delete args.input.supplierAddress;

      const settings = await getServerSettings();
      const { organization } = settings;
      const { zkpPrivateKey, zkpPublicKey, name } = organization;

      // Check the zkp key pair (throws an error if invalid pair):
      checkKeyPair(zkpPrivateKey, zkpPublicKey);

      const msa = new MSA({
        constants: {
          zkpPublicKeyOfBuyer: zkpPublicKey,
          zkpPublicKeyOfSupplier: _supplier.zkpPublicKey,
          ...input,
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

      const { object } = msg;
      const { rfpId } = args.input;

      const msaObject = object;
      const { sku } = msaObject.constants
      msaObject.rfpId = rfpId;

      const msaDoc = await saveMSA(msaObject);

      const { identity } = context;
      const { _id } = msaDoc;

      await saveNotice({
        resolved: false,
        category: 'msa',
        subject: `New MSA: for SKU ${sku}`,
        from: name,
        statusText: 'Pending',
        status: 'outgoing',
        categoryId: _id,
        lastModified: Math.floor(Date.now() / 1000),
      });

      console.log(`\nSending MSA (id: ${msaDoc._id}) to supplier for signing...`);
      msgDeliveryQueue.add({
        documentId: _id,
        senderId: identity,
        recipientId: _supplier.identity,
        payload: {
          type: 'msa_create',
          ...msaDoc,
        },
      });

      const { constants, ...msaData } = msaObject;
      const msaDetails = {
        _id,
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
