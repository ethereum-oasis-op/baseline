import { Commitment } from './commitment';
import { getPartnerByMessagingKey } from './partner';
import { formatProof, createMSA as createMSATransaction } from './shield';
import { generateProof } from './zkp';

import MSAModel from '../db/models/modules/msa';

import { getServerSettings } from '../utils/serverSettings';
import { calculatePrice } from '../utils/business-logic';
import { strip0x, flattenDeep } from '../utils/crypto/conversions';
import { Element, elementify } from '../utils/crypto/format-inputs';
import { edwardsDecompress } from '../utils/crypto/ecc/compress-decompress';
import { concatenateThenHash } from '../utils/crypto/hashes/sha256/sha256';

import msgDeliveryQueue from '../queues/message_delivery';
import { saveNotice } from './notice';

const pycryptojs = require('zokrates-pycryptojs');

import { logger } from 'radish34-logger';

/**
An msaDoc object (from the mongodb) contains an array of commitments.
But we only want to 'pop' the latest commitment from the array, to add it to our Commitment class.
This function extracts that 1 commitment from the msaDoc.
*/
export const extractMSAFromDoc = (msaDoc, index = 'latest') => {
  const msaObject = msaDoc;
  // strip out all irrelevant commitment objects; leaving one.
  // remove the commitments array.
  if (index === 'latest') {
    msaObject.commitment = msaObject.commitments[msaObject.commitments.length - 1];
    delete msaObject.commitments;
  } else {
    msaObject.commitment = msaObject.commitments[index];
    delete msaObject.commitments;
  }

  // extract the variables object from within the commitment, to be 'alongside' the commitment:
  msaObject.variables = msaObject.commitment.variables;
  delete msaObject.commitment.variables;

  return msaObject;
};

/**
This validates that the objects contain all mandatory keys, required for an MSA.
constants, variables, and commitments should all contain these keys, if passed into the MSA constructor.
*/
const validate = (object, objectType) => {
  // validate objects' keys:
  const requiredKeys = (type => {
    switch (type) {
      case 'constants':
        return [
          'zkpPublicKeyOfBuyer',
          'zkpPublicKeyOfSupplier',
          'tierBounds',
          'pricesByTier',
          'sku',
          'erc20ContractAddress',
        ];
      case 'variables':
        return ['accumulatedVolumeOrdered', 'accumulatedVolumeDelivered'];
      default:
        throw new Error('object type not recognised.');
    }
  })(objectType);

  const missingKeys = requiredKeys.filter(key => !(key in object));

  if (missingKeys.length > 0)
    throw new Error(`missing required keys for PO object ${objectType}: ${missingKeys}`);
};

/**
Structure of the database from which the class can be created:
db schema MSA: {
  constants: {}
  commitments: [
    {
      commitment: {
        variables: {}
      }
    }
  ]
}

Structure of the MSA class once its been constructed:
class MSA: {
  constants: {}
  variables: {}
  commitment: new Commitment()
}

Notice variables has moved up a level.
Notice commitment is not inside an array.

Retrieve a db formatted object through the .object getter.

Most getters return elementified values.
*/
export class MSA {
  constructor(msaObject) {
    const { _id, constants, variables = {}, commitment = {} } = msaObject;

    this._id = _id; // will be undefined if this MSA is not yet in the db

    validate(constants, 'constants');

    // Assign default values to undefined constants:
    const {
      zkpPublicKeyOfBuyer,
      zkpPublicKeyOfSupplier,
      tierBounds,
      pricesByTier,
      sku,
      erc20ContractAddress,
    } = constants;
    const {
      hashOfTieredPricing = concatenateThenHash(
        ...elementify(tierBounds).map(el => el.hex(32)),
        ...elementify(pricesByTier).map(el => el.hex(32)),
      ),
      minVolume = tierBounds[0],
      maxVolume = tierBounds[tierBounds.length - 1],
    } = constants;

    this._constants = { ...constants, hashOfTieredPricing, minVolume, maxVolume }; // the newly assigned duplicate keys supersede any already within constants.

    const { accumulatedVolumeOrdered = 0, accumulatedVolumeDelivered = 0 } = variables; // this defaults the variables to 0 if they're undefined.

    this._variables = { accumulatedVolumeOrdered, accumulatedVolumeDelivered };

    // Case 1:
    // If commitment = {}, then we're either constructing the commitment from variables = {...} or variables = {} (which defaults values to 0).

    // Case 2:
    // If commitment = {...}, then construct the commitment from this commitment object.
    if (Object.keys(commitment).length === 0) {
      // Case 1:
      const preimage = {
        zkpPublicKeyOfBuyer: elementify(zkpPublicKeyOfBuyer).hex(64),
        zkpPublicKeyOfSupplier: elementify(zkpPublicKeyOfSupplier).hex(64),
        hashOfTieredPricing: elementify(hashOfTieredPricing).hex(64),
        minVolume: elementify(minVolume).hex(32),
        maxVolume: elementify(maxVolume).hex(32),
        sku: elementify(sku).hex(32),
        erc20ContractAddress: elementify(erc20ContractAddress).hex(64),
        accumulatedVolumeOrdered: elementify(accumulatedVolumeOrdered).hex(32),
        accumulatedVolumeDelivered: elementify(accumulatedVolumeDelivered).hex(32),
      };

      this._commitment = new Commitment(preimage, {}, 'preimage');
    } else {
      // Case 2:
      this._commitment = new Commitment({}, commitment, 'commitment');
    }
  }

  get constants() {
    const constantsAsElements = elementify(this._constants);
    return constantsAsElements;
  }

  get commitment() {
    return this._commitment;
  }

  get variables() {
    const variablesAsElements = elementify(this._variables);
    return variablesAsElements;
  }

  /**
    Returns an object in the same format as the db.
    I.e.:
      - variables object inside the commitment object.
      - commitment object inside a commitments array.
  */
  get object() {
    const commitment = { ...this._commitment.object, variables: this._variables };
    return {
      ...(this._id !== undefined && { _id: this._id }),
      constants: this._constants,
      commitments: [commitment],
    };
  }

  set EdDSASignatures(EdDSASignatures) {
    this._constants = { ...this._constants, EdDSASignatures };
  }

  // Method
  price(volume) {
    return calculatePrice(
      this._constants.tierBounds,
      this._constants.pricesByTier,
      this._variables.accumulatedVolumeOrdered,
      volume,
    );
  }
}

export const getMSABySKUAndParties = async (zkpPublicKeyOfBuyer, zkpPublicKeyOfSupplier, sku, rfpId) => {
  try {
    const msa = await MSAModel.findOne({
      'constants.zkpPublicKeyOfBuyer': zkpPublicKeyOfBuyer,
      'constants.zkpPublicKeyOfSupplier': zkpPublicKeyOfSupplier,
      'constants.sku': sku,
      rfpId,
    }).lean();
    return msa;
  } catch (err) {
    logger.error('Error getting MSA from db.\n%o', err, { service: 'API' });
    return false;
  }
};

export const getMSAById = async id => {
  try {
    const msa = await MSAModel.findOne({ _id: id }).lean();
    return msa;
  } catch (err) {
    logger.error('Error getting MSA from db.\n%o', err, { service: 'API' });
    return false;
  }
};

export const getMSAsBySKU = async sku => {
  try {
    const msas = await MSAModel.find({ 'constants.sku': sku }).lean();
    return msas;
  } catch (err) {
    logger.error('Error getting MSA from db.\n%o', err, { service: 'API' });
    return false;
  }
};

export const getMSAsByRFPId = async rfpId => {
  try {
    const msas = await MSAModel.find({ rfpId }).lean();
    return msas;
  } catch (err) {
    logger.error('Error getting MSA from db.\n%o', err, { service: 'API' });
    return false;
  }
}

export const getAllMSAs = async requester => {
  try {
    const msas = await MSAModel
      .find({
        $or: [
          { 'constants.zkpPublicKeyOfBuyer': requester.zkpPublicKey },
          { 'constants.zkpPublicKeyOfSupplier': requester.zkpPublicKey }
        ]
      })
      .lean();
    return msas;
  } catch (err) {
    logger.error('Error getting MSA from db.\n%o', err, { service: 'API' });
    return false;
  }
};

export const saveMSA = async msaObject => {
  // eslint-disable-next-line
  const exists = await getMSABySKUAndParties(
    msaObject.constants.zkpPublicKeyOfBuyer,
    msaObject.constants.zkpPublicKeyOfSupplier,
    msaObject.constants.sku,
    msaObject.rfpId
  );
  if (exists) {
    logger.error(`MSA already exists for this SKU ${msaObject.constants.sku} with this supplier.`, { service: 'API' });
    throw new Error(
      `MSA already exists for this SKU ${msaObject.constants.sku} with this supplier.`,
    );
  }
  try {
    const doc = await MSAModel.create([msaObject], { upsert: true, new: true });
    logger.info('Saved MSA to db:\n%o', doc[0].toObject(), { service: 'API' });
    return doc[0].toObject();
  } catch (err) {
    logger.error('Error saving MSA in db.\n%o', err, { service: 'API' });
    return false;
  }
};

export const updateMSAWithSupplierSignature = async msaObject => {
  const {
    constants: {
      EdDSASignatures: {
        supplier: { R, S },
      },
    },
  } = msaObject;

  const exists = await getMSABySKUAndParties(
    msaObject.constants.zkpPublicKeyOfBuyer,
    msaObject.constants.zkpPublicKeyOfSupplier,
    msaObject.constants.sku,
    msaObject.rfpId,
  );

  if (!exists) {
    logger.error(`MSA does not exist for this SKU ${msaObject.constants.sku} with this supplier. Hence cannot be updated.`, { service: 'API' });
    throw new Error(
      `MSA does not exist for this SKU ${msaObject.constants.sku} with this supplier. Hence cannot be updated.`,
    );
  }
  try {
    const doc = await MSAModel.findOneAndUpdate(
      {
        'constants.zkpPublicKeyOfBuyer': msaObject.constants.zkpPublicKeyOfBuyer,
        'constants.zkpPublicKeyOfSupplier': msaObject.constants.zkpPublicKeyOfSupplier,
        'constants.sku': msaObject.constants.sku,
        rfpId: msaObject.rfpId,
      },
      {
        $set: {
          'constants.EdDSASignatures.supplier': {
            R: R,
            S: S,
          },
        },
      },
      { new: true },
    ).lean();
    logger.info("MSA has been updated with supplier's signature:\n%o", doc, { service: 'API' });
    return doc;
  } catch (err) {
    logger.error('Error updating MSA in db.\n%o', err, { service: 'API' });
    return false;
  }
};

export const updateMSAWithNewCommitment = async msaObject => {
  const exists = await getMSAById(msaObject._id);
  if (!exists) {
    logger.error(`MSA does not exist for this msaId ${msaObject._id}. Hence cannot be updated.`, { service: 'API' });
    throw new Error(`MSA does not exist for this msaId ${msaObject._id}. Hence cannot be updated.`);
  }

  const latestCommitmentIndex = msaObject.commitments.length - 1;

  try {
    const doc = await MSAModel.findOneAndUpdate(
      { _id: msaObject._id },
      {
        $push: {
          commitments: msaObject.commitments[latestCommitmentIndex],
        },
      },
      { new: true, upsert: true },
    ).lean();
    logger.info('Updated MSA with new commitment:\n%o', doc, { service: 'API' });
    return doc;
  } catch (err) {
    logger.error('Error updating MSA in db.\n%o', err, { service: 'API' });
    return false;
  }
};

export const updateMSAWithCommitmentIndex = async msaObject => {
  const docBeforeUpdate = await getMSAById(msaObject._id);
  if (!docBeforeUpdate) {
    logger.error(`MSA does not exist for this msaId ${msaObject._id}. Hence cannot be updated.`, { service: 'API' });
    throw new Error(`MSA does not exist for this msaId ${msaObject._id}. Hence cannot be updated.`);
  }
  const { index } = msaObject.commitments[0];
  try {
    const doc = await MSAModel.findOneAndUpdate(
      {
        _id: msaObject._id,
        commitments: {
          $elemMatch: {
            index: { $exists: false },
          },
        },
      },
      {
        $set: {
          'commitments.$.index': index,
        },
      },
      { new: true, upsert: true },
    ).lean();
    logger.info('Updated MSA with new commitment index:\n%o', doc, { service: 'API' });
    return doc;
  } catch (e) {
    logger.error('Error updating MSA in db.\n%o', err, { service: 'API' });
    return false;
  }
};

/**
compute-witness, generate proof and send a transaction to the shield contract.
*/
export const createMSA = async msa => {
  const _publicInputHash = concatenateThenHash(msa.commitment.commitment.hex());
  // Convert everything to an element class. We'll then order elements later.
  const publicInputHash = new Element(_publicInputHash, 'hex');

  const zkpPublicKeyOfBuyer = elementify(
    edwardsDecompress(msa.constants.zkpPublicKeyOfBuyer.hex()),
  );
  const zkpPublicKeyOfSupplier = elementify(
    edwardsDecompress(msa.constants.zkpPublicKeyOfSupplier.hex()),
  );
  const signatureOfBuyerR = elementify(
    edwardsDecompress(msa.constants.EdDSASignatures.buyer.R.hex()),
  );
  const signatureOfBuyerS = elementify(msa.constants.EdDSASignatures.buyer.S.hex());
  const signatureOfSupplierR = elementify(
    edwardsDecompress(msa.constants.EdDSASignatures.supplier.R.hex()),
  );
  const signatureOfSupplierS = elementify(msa.constants.EdDSASignatures.supplier.S.hex());

  // Structure the inputs array in the exact order expected by the zokrates main() function:
  const allInputs = [
    publicInputHash.field(248, 1, true),

    zkpPublicKeyOfBuyer.map(el => el.field(254, 1)),
    zkpPublicKeyOfSupplier.map(el => el.field(254, 1)),
    msa.constants.tierBounds.map(el => el.field(128, 1)),
    msa.constants.pricesByTier.map(el => el.field(128, 1)),
    msa.constants.hashOfTieredPricing.field(128, 2),
    msa.constants.minVolume.field(128, 1),
    msa.constants.maxVolume.field(128, 1),
    msa.constants.sku.field(128, 1),
    msa.constants.erc20ContractAddress.field(128, 2),
    signatureOfBuyerR.map(el => el.field(254, 1)),
    signatureOfBuyerS.field(254, 1),
    signatureOfSupplierR.map(el => el.field(254, 1)),
    signatureOfSupplierS.field(254, 1),

    msa.variables.accumulatedVolumeOrdered.field(128, 1),
    msa.variables.accumulatedVolumeDelivered.field(128, 1),

    msa.commitment.commitment.field(128, 2),
    msa.commitment.salt.field(128, 2),
  ];
  
  let proofOut;
  const flattenedInputs = flattenDeep(allInputs);
  logger.info('Requesting a proof be generated by zokrates...', { service: 'API' });
  const zkpMode = process.env.ZKP_MODE || 0; // Default to createMSA/createPO
  if (zkpMode == 0) {
    proofOut = await generateProof('createMSA', flattenedInputs);
  } else if (zkpMode == 1) {
    proofOut = await generateProof('createDummyMSA', flattenedInputs);
  }
  const proofArray = formatProof(proofOut.proof);

  const publicInputs = [msa.commitment.commitment.hex()];

  const { transactionHash, leafIndex, leafValue, newRoot } = await createMSATransaction(
    proofArray,
    publicInputHash.field(248, 1, true),
    publicInputs,
  );

  logger.info('Create MSA TX complete.', { service: 'API'});

  return {
    transactionHash,
    leafIndex,
    leafValue,
    newRoot,
  };
};

export const onReceiptMSASupplier = async (msaObj, senderWhisperKey) => {
  const msa = await saveMSA(msaObj);
  const partner = await getPartnerByMessagingKey(senderWhisperKey);
  const { organization } = await getServerSettings();
  const { zkpPrivateKey } = organization;

  const {
    constants: { EdDSASignatures },
    commitments: commitment,
  } = msa;

  const { buyer } = EdDSASignatures;

  // Sender of the MSA message should be the same as the party that signed the MSA
  if (msa.constants.zkpPublicKeyOfBuyer === partner.zkpPublicKey) {
    const isSignVerified = await pycryptojs.verify(
      strip0x(msa.constants.zkpPublicKeyOfBuyer),
      strip0x(commitment[0].commitment),
      buyer.R,
      buyer.S,
    );
    logger.info("Buyer's signature has been verified successfully.", { service: 'API'});

    if (isSignVerified) {
      const signature = await pycryptojs.sign(
        strip0x(zkpPrivateKey),
        strip0x(commitment[0].commitment),
      );

      msa.constants.EdDSASignatures.supplier = {
        R: signature[0],
        S: signature[1],
      };

      const msaDoc = await updateMSAWithSupplierSignature(msa);

      await saveNotice({
        resolved: false,
        category: 'msa',
        subject: `New MSA: for SKU ${msaDoc.constants.sku}`,
        from: partner.name,
        statusText: 'Pending',
        status: 'incoming',
        categoryId: msaDoc._id,
        lastModified: Math.floor(Date.now() / 1000),
      });

      msgDeliveryQueue.add(
        {
          documentId: msa._id,
          senderId: organization.messagingKey,
          recipientId: partner.messagingKey,
          payload: {
            type: 'signed_msa',
            ...msaDoc,
          }
        },
        {
          // Mark job as failed after 20sec so subsequent jobs are not stalled
          timeout: 20000,
        },
      );
      logger.info("Sent signed MSA to buyer.", { service: 'API'});
    }
  } else {
    logger.error(`The public key for signature ${buyer.A} doesn't match with the sender of the MSA creation message ${partner.zkpPublicKey}.`, { service: 'API' });
    throw new Error(
      `The public key for signature ${buyer.A} doesn't match with the sender of the MSA creation message ${partner.zkpPublicKey}.`,
    );
  }
};

export const onReceiptMSABuyer = async (msaObj, senderWhisperKey) => {
  const partner = await getPartnerByMessagingKey(senderWhisperKey);

  const {
    constants: { EdDSASignatures },
    commitments: commitment,
  } = msaObj;

  const { supplier } = EdDSASignatures;

  // Sender of the MSA message should be the same as the party that signed the MSA
  if (msaObj.constants.zkpPublicKeyOfSupplier === partner.zkpPublicKey) {
    const isSignVerified = await pycryptojs.verify(
      strip0x(msaObj.constants.zkpPublicKeyOfSupplier),
      strip0x(commitment[0].commitment),
      supplier.R,
      supplier.S,
    );
    logger.info("MSA signature verification success.", { service: 'API'});

    if (isSignVerified) {
      const msaDoc = await updateMSAWithSupplierSignature(msaObj);

      const msa = new MSA(extractMSAFromDoc(msaDoc));

      // keep unused variables here for now; they might be used soon...
      const { transactionHash, leafIndex, leafValue, newRoot } = await createMSA(msa);

      msa.commitment.index = leafIndex;

      const msaObject = msa.object;

      await updateMSAWithCommitmentIndex(msaObject);

      // TODO: send the index in a message to the Supplier!!!

      return msaObject;
    }
    throw new Error(`Supplier's signature verification failed`);
  } else {
    throw new Error(
      `The public key for signature ${supplier.A} doesn't match with the sender of the MSA creation message ${partner.zkpPublicKey}`,
    );
  }
};
