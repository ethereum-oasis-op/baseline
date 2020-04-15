import { Commitment } from './commitment';
import { getPartnerByMessengerKey } from './partner';
import { formatProof, createMSA as createAgreementTx } from './shield';
import { generateProof } from './zkp';

import AgreementModel from '../integrations/agreement';

import { getServerSettings } from '../utils/serverSettings';
import { strip0x, flattenDeep } from '../utils/crypto/conversions';
import { Element, elementify } from '../utils/crypto/format-inputs';
import { edwardsDecompress } from '../utils/crypto/ecc/compress-decompress';
import { concatenateThenHash } from '../utils/crypto/hashes/sha256/sha256';

import msgDeliveryQueue from '../queues/message_delivery';
import { saveNotice } from './notice';

const pycryptojs = require('zokrates-pycryptojs');

let _commitment;

/**
An msaDoc object (from the mongodb) contains an array of commitments.
But we only want to 'pop' the latest commitment from the array, to add it to our Commitment class.
This function extracts that 1 commitment from the msaDoc.
*/
export const extractAgreementFromDoc = (agreementDoc, index = 'latest') => {
  const agreementObject = agreementDoc;
  // strip out all irrelevant commitment objects; leaving one.
  // remove the commitments array.
  if (index === 'latest') {
    agreementObject.commitment = agreementObject.commitments[agreementObject.commitments.length - 1];
    delete agreementObject.commitments;
  } else {
    agreementObject.commitment = agreementObject.commitments[index];
    delete agreementObject.commitments;
  }
  return agreementObject;
};

/**
Structure of the database from which the class can be created:
db schema Agreement: {
  constants: {}
  commitments: [
    {
      commitment: {
      },
      index: {
      },
      salt: {
      },
      nullifer: {
      }
    }
  ]
}
**/

const validate = (object, objectType) => {
  // validate objects' keys:
  const requiredKeys = (type => {
    switch (type) {
      case 'constants':
        return [
          'zkpPublicKeyOfBuyer',
          'zkpPublicKeyOfSupplier',
          'name',
          'description',
          'erc20ContractAddress',
        ];
      default:
        throw new Error('object type not recognised.');
    }
  })(objectType);

  const missingKeys = requiredKeys.filter(key => !(key in object));

  if (missingKeys.length > 0)
    throw new Error(`missing required keys for PO object ${objectType}: ${missingKeys}`);
};


export const generateCommitment = (data) => {
  const { _id, constants, variables = {}, commitment = {}, initType } = data;

  const {
    zkpPublicKeyOfSender,
    zkpPublicKeyOfRecipient,
    name,
    description,
    erc20ContractAddress,
  }  = constants;

  if (Object.keys(commitment).length !== 0) {
    // Case 1:
    const preimage = {
      zkpPublicKeyOfSender: elementify(zkpPublicKeyOfSender).hex(64),
      zkpPublicKeyOfRecipient: elementify(zkpPublicKeyOfRecipient).hex(64),
      name: elementify(name).hex(32),
      description: elementify(description).hex(32),
      erc20ContractAddress: elementify(erc20ContractAddress).hex(64),
    };
    _commitment = new Commitment(preimage, {}, initType);
  } else {
    // Case 2:
    _commitment = new Commitment({}, commitment, initType);
  }
  return _commitment;
};

export const getAgreementById = async id => {
  try {
    const agreement = await AgreementModel.findOne({ _id: id }).lean();
    return agreement;
  } catch (e) {
    console.log('\nError getting Agreement from DB: ', e);
    return false;
  }
};

export const getAgreementsByName = async name => {
  try {
    const msas = await AgreementModel.find({ 'constants.name': name }).lean();
    return msas;
  } catch (e) {
    console.log('\nError getting Agremement from DB: ', e);
    return false;
  }
};

