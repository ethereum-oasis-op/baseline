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