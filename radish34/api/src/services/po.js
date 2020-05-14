import { Commitment } from './commitment';
import { checkRoot } from './merkle-tree';
import { updateMSAWithNewCommitment } from './msa';
import { getPartnerByMessengerKey } from './partner';
import { formatProof, createPO as createPOTransaction } from './shield';
import { generateProof } from './zkp';

import { POModel } from '../integrations/po';

import { getServerSettings } from '../utils/serverSettings';
import { flattenDeep } from '../utils/crypto/conversions';
import { Element, elementify } from '../utils/crypto/format-inputs';
import { edwardsDecompress } from '../utils/crypto/ecc/compress-decompress';
import { concatenateThenHash } from '../utils/crypto/hashes/sha256/sha256';

import msgDeliveryQueue from '../queues/message_delivery';
import { saveNotice } from './notice';

/**
A poDoc object (from the mongodb) contains an array of commitments.
But we only want to 'pop' the latest commitment from the array, to add it to our Commitment class.
This function extracts that 1 commitment from the poDoc.
*/
export const extractPOFromDoc = (poDoc, index = 'latest') => {
  const poObject = poDoc;
  // strip out all irrelevant commitment objects; leaving one.
  // remove the commitments array.
  if (index === 'latest') {
    poObject.commitment = poObject.commitments[poObject.commitments.length - 1];
    delete poObject.commitments;
  } else {
    poObject.commitment = poObject.commitments[index];
    delete poObject.commitments;
  }

  // extract the variables object from within the commitment, to be 'alongside' the commitment:
  poObject.variables = poObject.commitment.variables;
  delete poObject.commitment.variables;

  return poObject;
};

/**
This validates that the objects contain all mandatory keys, required for an MSA.
constants, variables, and commitment should all contain these keys, if passed into the PO constructor.
*/
const validate = (object, objectType) => {
  // validate objects' keys:
  const requiredKeys = (type => {
    switch (type) {
      case 'constants':
        return [
          'zkpPublicKeyOfBuyer',
          'zkpPublicKeyOfSupplier',
          'volume',
          'price',
          'sku',
          'erc20ContractAddress',
        ];
      case 'variables':
        return ['accumulatedVolumeDelivered'];
      default:
        throw new Error('object type not recognised.');
    }
  })(objectType);

  const missingKeys = requiredKeys.filter(key => !(key in object));

  if (missingKeys.length > 0)
    throw new Error(`missing required keys for PO object ${objectType}: ${missingKeys}`);
};

export class PO {
  constructor(poObject) {
    const { _id, constants, variables = {}, commitment = {} } = poObject;

    this._id = _id; // will be undefined if not yet in db

    validate(constants, 'constants');
    // Assign default values to undefined constants:
    const {
      zkpPublicKeyOfBuyer,
      zkpPublicKeyOfSupplier,
      volume,
      price,
      sku,
      erc20ContractAddress,
    } = constants;

    this._constants = constants;

    const { accumulatedVolumeDelivered = 0 } = variables; // this defaults the variables to 0 if they're undefined.

    this._variables = { accumulatedVolumeDelivered };

    // Case 1:
    // If commitment = {}, then we're either constructing the commitment from variables = {...} or variables = {} (which defaults values to 0).

    // Case 2:
    // If commitment = {...}, then construct the commitment from this commitment object.
    if (Object.keys(commitment).length === 0) {
      // Case 1:
      const preimage = {
        zkpPublicKeyOfBuyer: elementify(zkpPublicKeyOfBuyer).hex(64),
        zkpPublicKeyOfSupplier: elementify(zkpPublicKeyOfSupplier).hex(64),
        volume: elementify(volume).hex(32),
        price: elementify(price).hex(32),
        sku: elementify(sku).hex(32),
        erc20ContractAddress: elementify(erc20ContractAddress).hex(64),
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

  get object() {
    const commitment = { ...this._commitment.object, variables: this._variables };
    return {
      ...(this._id !== undefined && { _id: this._id }),
      constants: this._constants,
      commitments: [commitment],
    };
  }
}

export const getPOById = async id => {
  try {
    const po = await POModel.findOne({ _id: id }).lean();
    return po;
  } catch (e) {
    console.log('Error getting PO from DB: ', e);
    return false;
  }
};

export const getAllPOs = async () => {
  try {
    const pos = await POModel.find({})
      .lean()
      .toArray();
    return pos;
  } catch (e) {
    console.log('Error getting PO from DB: ', e);
    return false;
  }
};

export const savePO = async poObject => {
  try {
    const doc = await POModel.create([poObject], { upsert: true, new: true });
    console.log('\nSaved PO to DB:');
    console.dir(doc[0].toObject(), { depth: null });
    return doc[0].toObject();
  } catch (e) {
    console.log('\nError saving PO in DB: ', e);
    return false;
  }
};

export const updatePOWithNewCommitment = async poObject => {
  const exists = await getPOById(poObject._id);
  if (!exists)
    throw new Error(`PO does not exist for this msaId ${poObject._id}. Hence cannot be updated`);
  try {
    const doc = await POModel.findOneAndUpdate(
      { _id: poObject._id },
      {
        $push: {
          commitments: poObject.commitments[0],
        },
      },
      { new: true, upsert: true },
    ).lean();
    console.log('\nUpdated PO with new commitment:');
    console.dir(doc, { depth: null });
    return doc;
  } catch (e) {
    console.log('\nError updating PO in DB: ', e);
    return false;
  }
};

export const updatePOWithCommitmentIndex = async poObject => {
  const docBeforeUpdate = await getPOById(poObject._id);
  if (!docBeforeUpdate)
    throw new Error(`PO does not exist for this msaId ${poObject._id}. Hence cannot be updated`);
  const { index } = poObject.commitments[0];
  try {
    const doc = await POModel.findOneAndUpdate(
      {
        _id: poObject._id,
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
    console.log('\nUpdated PO with new commitment index:');
    console.dir(doc, { depth: null });
    return doc;
  } catch (e) {
    console.log('\nError updating PO in DB: ', e);
    return false;
  }
};

export const createPO = async (_zkpPrivateKeyOfBuyer, oldMSA, newMSA, po) => {
  const _oldMSASiblingPath = await oldMSA.commitment.siblingPath;
  const oldMSASiblingPath = elementify(_oldMSASiblingPath);
  const root = oldMSASiblingPath[0]; // we need to grab the root at the same time we grab the siblingPath, or they could mismatch.

  // TODO: checkRoot() is not essential. It's only useful for debugging as we make iterative improvements to the zokrates files. Possibly delete in future.
  checkRoot(
    oldMSA.commitment.commitment.hex(64),
    Number(oldMSA.commitment.index.integer),
    oldMSASiblingPath.map(el => el.hex()),
    root.hex(64),
  );

  const _publicInputHash = concatenateThenHash(
    root.hex(64),
    oldMSA.commitment.nullifier.hex(64),
    newMSA.commitment.commitment.hex(64),
    po.commitment.commitment.hex(64),
  );

  // Convert everything to an element class. We'll then order elements later.
  const publicInputHash = new Element(_publicInputHash, 'hex');
  const zkpPrivateKeyOfBuyer = new Element(_zkpPrivateKeyOfBuyer, 'hex');

  const zkpPublicKeyOfBuyer = elementify(
    edwardsDecompress(oldMSA.constants.zkpPublicKeyOfBuyer.hex()),
  );
  const zkpPublicKeyOfSupplier = elementify(
    edwardsDecompress(oldMSA.constants.zkpPublicKeyOfSupplier.hex()),
  );

  // Structure the inputs array in the exact order expected by the zokrates main() function:
  const allInputs = [
    publicInputHash.field(248, 1, true),
    zkpPrivateKeyOfBuyer.field(128, 2),
    root.field(128, 2),

    zkpPublicKeyOfBuyer.map(el => el.field(254, 1)),
    zkpPublicKeyOfSupplier.map(el => el.field(254, 1)),
    oldMSA.constants.tierBounds.map(el => el.field(128, 1)),
    oldMSA.constants.pricesByTier.map(el => el.field(128, 1)),
    oldMSA.constants.hashOfTieredPricing.field(128, 2),
    oldMSA.constants.minVolume.field(128, 1),
    oldMSA.constants.maxVolume.field(128, 1),
    oldMSA.constants.sku.field(128, 1),
    oldMSA.constants.erc20ContractAddress.field(128, 2),

    oldMSA.variables.accumulatedVolumeOrdered.field(128, 1),
    oldMSA.variables.accumulatedVolumeDelivered.field(128, 1),

    oldMSA.commitment.commitment.field(128, 2),
    oldMSA.commitment.salt.field(128, 2),
    oldMSA.commitment.index.field(128, 1),
    oldMSA.commitment.nullifier.field(128, 2),
    oldMSASiblingPath
      .slice(1) // remove the root, as we pass that in separately
      .map(el => el.field(216, 1, true)), // we truncate to 216 bits, because 2*216 fits within a single sha256 digest.

    zkpPublicKeyOfBuyer.map(el => el.field(254, 1)),
    zkpPublicKeyOfSupplier.map(el => el.field(254, 1)),
    newMSA.constants.hashOfTieredPricing.field(128, 2),
    newMSA.constants.minVolume.field(128, 1),
    newMSA.constants.maxVolume.field(128, 1),
    newMSA.constants.sku.field(128, 1),
    newMSA.constants.erc20ContractAddress.field(128, 2),

    newMSA.variables.accumulatedVolumeOrdered.field(128, 1),
    newMSA.variables.accumulatedVolumeDelivered.field(128, 1),

    newMSA.commitment.commitment.field(128, 2),
    newMSA.commitment.salt.field(128, 2),

    zkpPublicKeyOfBuyer.map(el => el.field(254, 1)),
    zkpPublicKeyOfSupplier.map(el => el.field(254, 1)),
    po.constants.volume.field(128, 1),
    po.constants.price.field(128, 1),
    po.constants.sku.field(128, 1),
    po.constants.erc20ContractAddress.field(128, 2),

    po.variables.accumulatedVolumeDelivered.field(128, 1),

    po.commitment.commitment.field(128, 2),
    po.commitment.salt.field(128, 2),
  ];
  let proofOut;
  console.log(`\nRequesting a proof be generated by zokrates...`);
  const zkpMode = process.env.ZKP_MODE || 0; // Default to createMSA/createPO
  if (zkpMode == 0) {
    proofOut = await generateProof('createPO', flattenDeep(allInputs));
  } else if (zkpMode == 1) {
    proofOut = await generateProof('createDummyPO', flattenDeep(allInputs));
  }
  const proofArray = formatProof(proofOut.proof);

  const publicInputs = [
    root.hex(64),
    oldMSA.commitment.nullifier.hex(64),
    newMSA.commitment.commitment.hex(64),
    po.commitment.commitment.hex(64),
  ];

  const {
    transactionHash,
    newMSALeafIndex,
    newMSALeafValue,
    newPOLeafIndex,
    newPOLeafValue,
    newRoot,
  } = await createPOTransaction(proofArray, publicInputHash.field(248, 1, true), publicInputs);

  console.log('\nCREATE PO TRANSACTION COMPLETE');

  return {
    transactionHash,
    newMSALeafIndex,
    newMSALeafValue,
    newPOLeafIndex,
    newPOLeafValue,
    newRoot,
  };
};

// TODO: we need to actually make sure that it was indeed the Buyer of this MSA who has sent us the MSA. Otherwise, we could be updating the MSA db with bogus information from a random person.
// TODO: we need to check that the commitment actually exists at the purported index on-chain.
export const onReceiptPOSupplier = async (messageObj, senderWhisperKey) => {
  const sender = await getPartnerByMessengerKey(senderWhisperKey);
  const { po, msa } = messageObj;

  const poDoc = await savePO(po);
  const msaDoc = await updateMSAWithNewCommitment(msa);

  await saveNotice({
    resolved: false,
    category: 'po',
    subject: `New PO for SKU: ${poDoc.constants.sku}`,
    from: sender.name,
    statusText: 'Pending',
    status: 'incoming',
    categoryId: poDoc._id,
    lastModified: Math.floor(Date.now() / 1000),
  });

  // more logic required here in future...
};
