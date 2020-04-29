import { Commitment } from './commitment';
import { getTxReceipt, getContractWithWalletByName } from './contract';
import { getPartnerByMessengerKey } from './partner';
import { getEventValuesFromTxReceipt } from '../utils/ethers';
import { formatProof, getRoot, createAgreement as createAgreementTx } from './shield';
import { getSiblingPath, getSiblingPathByLeafIndex, checkRoot } from './merkle-tree';
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
An agreementDoc object (from the mongodb) contains an array of commitments.
But we only want to 'pop' the latest commitment from the array, to add it to our Commitment class.
This function extracts that 1 commitment from the agreementDoc.
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
          'zkpPublicKeyOfSender',
          'zkpPublicKeyOfRecipient',
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

export class Agreement {
  constructor(agreementObject) {
    const { _id, constants, commitment = {} } = agreementObject;

    this._id = _id; // will be undefined if this Agreement is not yet in the db

    validate(constants, 'constants');

    // Assign default values to undefined constants:
    const {
      zkpPublicKeyOfSender,
      zkpPublicKeyOfRecipient,
      name,
      description,
      erc20ContractAddress,
    } = constants;

    this._constants = constants; // the newly assigned duplicate keys supersede any already within constants.

    // Case 1:
    // If commitment = {}, then we're either constructing the commitment from variables = {...} or variables = {} (which defaults values to 0).

    // Case 2:
    // If commitment = {...}, then construct the commitment from this commitment object.
    if (Object.keys(commitment).length === 0) {
      // Case 1:
      const preimage = {
        zkpPublicKeyOfSender: elementify(zkpPublicKeyOfSender).hex(64),
        zkpPublicKeyOfRecipient: elementify(zkpPublicKeyOfRecipient).hex(64),
        name: elementify(name).hex(32),
        description: elementify(description).hex(32),
        erc20ContractAddress: elementify(erc20ContractAddress).hex(64),
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
}

export const getAgreementByNameAndParties = async (zkpPublicKeyOfSender, zkpPublicKeyOfRecipient, name, prevId) => {
  try {
    const agreement = await AgreementModel.findOne({
      'constants.zkpPublicKeyOfSender': zkpPublicKeyOfSender,
      'constants.zkpPublicKeyOfRecipient': zkpPublicKeyOfRecipient,
      'constants.name': name,
      prevId,
    }).lean();
    return agreement;
  } catch (e) {
    console.log('\nError getting Agreement from DB: ', e);
    return false;
  }
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
    const agreements = await AgreementModel.find({ 'constants.name': name }).lean();
    return agreements;
  } catch (e) {
    console.log('\nError getting Agremement from DB: ', e);
    return false;
  }
};

export const getAgreementsByPrevId = async prevId => {
  try {
    const agreements = await AgreementModel.find({ prevId }).lean();
    return agreements;
  } catch (e) {
    console.log('\nError getting Agreement from DB: ', e);
    return false;
  }
};

export const getAllAgreements = async requester => {
  try {
    const agreements = await AgreementModel
      .find({
        $or: [
          { 'constants.zkpPublicKeyOfSender': requester.zkpPublicKey },
          { 'constants.zkpPublicKeyOfRecipient': requester.zkpPublicKey }
        ]
      })
      .lean();
    return agreements;
  } catch (e) {
    console.log('\nError getting Agreement from DB: ', e);
    return false;
  }
};

export const saveAgreement = async agreementObject => {
  // eslint-disable-next-line
  const exists = await getAgreementByNameAndParties(
    agreementObject.constants.zkpPublicKeyOfSender,
    agreementObject.constants.zkpPublicKeyOfRecipient,
    agreementObject.constants.name,
    agreementObject.prevId
  );
  if (exists)
    throw new Error(
      `Agreement already exists for this SKU ${agreementObject.constants.name} with this Recipient`,
    );
  try {
    const doc = await AgreementModel.create([agreementObject], { upsert: true, new: true });
    console.log('\nSaved Agreement to DB');
    console.dir(doc[0].toObject(), { depth: null });
    return doc[0].toObject();
  } catch (e) {
    console.log('\nError saving Agreement in DB: ', e);
    return false;
  }
};

export const updateAgreementWithRecipientSignature = async agreementObject => {
  const {
    constants: {
      EdDSASignatures: {
        recipient: { R, S },
      },
    },
  } = agreementObject;

  const exists = await getAgreementByNameAndParties(
    agreementObject.constants.zkpPublicKeyOfSender,
    agreementObject.constants.zkpPublicKeyOfRecipient,
    agreementObject.constants.name,
    agreementObject.prevId,
  );
  console.log('Agreement object', agreementObject, 'exists', exists);
  if (!exists)
    throw new Error(
      `Agreement does not exist for this name ${agreementObject.constants.name} with this recipient. Hence cannot be updated`,
    );
  try {
    const doc = await AgreementModel.findOneAndUpdate(
      {
        'constants.zkpPublicKeyOfSender': agreementObject.constants.zkpPublicKeyOfSender,
        'constants.zkpPublicKeyOfRecipient': agreementObject.constants.zkpPublicKeyOfRecipient,
        'constants.name': agreementObject.constants.name,
        prevId: agreementObject.prevId,
      },
      {
        $set: {
          'constants.EdDSASignatures.recipient': {
            R: R,
            S: S,
          },
        },
      },
      { new: true },
    ).lean();
    console.log("\Agreement has been updated with Recipient's signature\n");
    console.dir(doc, { depth: null });
    return doc;
  } catch (e) {
    console.log('\nError updating Agreement in DB: ', e);
    return false;
  }
};

export const updateAgreementWithNewCommitment = async agreementObject => {
  const exists = await getAgreementById(agreementObject._id);
  if (!exists)
    throw new Error(`Agreement does not exist for this agreementId ${agreementObject._id}. Hence cannot be updated`);

  const latestCommitmentIndex = agreementObject.commitments.length - 1;

  try {
    const doc = await AgreementModel.findOneAndUpdate(
      { _id: agreementObject._id },
      {
        $push: {
          commitments: agreementObject.commitments[latestCommitmentIndex],
        },
      },
      { new: true, upsert: true },
    ).lean();
    console.log('\nUpdated Agreement with new commitment:');
    console.dir(doc, { depth: null });
    return doc;
  } catch (e) {
    console.log('\nError updating Agreement in DB: ', e);
    return false;
  }
};

export const updateAgreementWithCommitmentIndex = async agreementObject => {
  const docBeforeUpdate = await getAgreementById(agreementObject._id);
  if (!docBeforeUpdate)
    throw new Error(`Agreement does not exist for this agreementId ${agreementObject._id}. Hence cannot be updated`);
  const { index } = agreementObject.commitments[0];
  try {
    const doc = await AgreementModel.findOneAndUpdate(
      {
        _id: agreementObject._id,
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
    console.log('\nUpdated Agreement with new commitment index:');
    console.dir(doc, { depth: null });
    return doc;
  } catch (e) {
    console.log('\nError updating Agreement in DB: ', e);
    return false;
  }
};

/**
compute-witness, generate proof and send a transaction to the shield contract.
*/
export const createAgreement = async agreement => {
  const _publicInputHash = concatenateThenHash(agreement.commitment.commitment.hex());
  // Convert everything to an element class. We'll then order elements later.
  const publicInputHash = new Element(_publicInputHash, 'hex');

  const zkpPublicKeyOfSender = elementify(
    edwardsDecompress(agreement.constants.zkpPublicKeyOfSender.hex()),
  );
  const zkpPublicKeyOfRecipient = elementify(
    edwardsDecompress(agreement.constants.zkpPublicKeyOfRecipient.hex()),
  );
  const signatureOfSenderR = elementify(
    edwardsDecompress(agreement.constants.EdDSASignatures.sender.R.hex()),
  );
  const signatureOfSenderS = elementify(agreement.constants.EdDSASignatures.sender.S.hex());
  const signatureOfRecipientR = elementify(
    edwardsDecompress(agreement.constants.EdDSASignatures.recipient.R.hex()),
  );
  const signatureOfRecipientS = elementify(agreement.constants.EdDSASignatures.recipient.S.hex());

  // Structure the inputs array in the exact order expected by the zokrates main() function:
  const allInputs = [
    publicInputHash.field(248, 1, true),

    zkpPublicKeyOfSender.map(el => el.field(254, 1)),
    zkpPublicKeyOfRecipient.map(el => el.field(254, 1)),
    agreement.constants.name.field(128, 1),
    agreement.constants.description.field(128, 1),
    agreement.constants.erc20ContractAddress.field(128, 2),
    signatureOfSenderR.map(el => el.field(254, 1)),
    signatureOfSenderS.field(254, 1),
    signatureOfRecipientR.map(el => el.field(254, 1)),
    signatureOfRecipientS.field(254, 1),

    agreement.commitment.commitment.field(128, 2),
    agreement.commitment.salt.field(128, 2),
  ];

  console.log(`\nRequesting a proof be generated by zokrates...`);
  const { proof } = await generateProof('createAgreement', flattenDeep(allInputs));
  const proofArray = formatProof(proof);

  const publicInputs = [agreement.commitment.commitment.hex()];

  const { transactionHash, leafIndex, leafValue, newRoot } = await createAgreementTx(
    proofArray,
    publicInputHash.field(248, 1, true),
    publicInputs,
  );

  console.log('\nCREATE AGREEMENT TRANSACTION COMPLETE');

  return {
    transactionHash,
    leafIndex,
    leafValue,
    newRoot,
  };
};

export const onReceiptAgreementRecipient = async (agreementObject, senderWhisperKey) => {
  const agreement = await saveAgreement(agreementObject);
  const partner = await getPartnerByMessengerKey(senderWhisperKey);
  const { organization } = await getServerSettings();
  const { zkpPrivateKey } = organization;

  const {
    constants: { EdDSASignatures },
    commitments: commitment,
  } = agreement;

  const { sender } = EdDSASignatures;

  // Sender of the Agreement message should be the same as the party that signed the Agreement
  if (agreement.constants.zkpPublicKeyOfSender === partner.zkpPublicKey) {
    const isSignVerified = await pycryptojs.verify(
      strip0x(agreement.constants.zkpPublicKeyOfSender),
      strip0x(commitment[0].commitment),
      sender.R,
      sender.S,
    );
    console.log("\nSender's signature has been verified successfully");

    if (isSignVerified) {
      const signature = await pycryptojs.sign(
        strip0x(zkpPrivateKey),
        strip0x(commitment[0].commitment),
      );

      agreement.constants.EdDSASignatures.recipient = {
        R: signature[0],
        S: signature[1],
      };

      const agreementDoc = await updateAgreementWithRecipientSignature(agreement);
      await saveNotice({
        resolved: false,
        category: 'agreement',
        subject: `New Agreement: for name ${agreementDoc.constants.name}`,
        from: partner.name,
        statusText: 'Pending',
        status: 'incoming',
        categoryId: agreementDoc._id,
        lastModified: Math.floor(Date.now() / 1000),
      });

      msgDeliveryQueue.add({
        documentId: agreement._id,
        senderId: organization.messengerKey,
        recipientId: partner.identity,
        payload: {
          type: 'signed_agreement',
          ...agreementDoc,
        },
      });
      console.log('\nSent signed Agreement to Sender');
    }
  } else {
    throw new Error(
      `The public key for signature ${sender.A} doesn't match with the sender of the agreement creation message ${partner.zkpPublicKey}`,
    );
  }
};

export const onReceiptAgreementSender = async (agreementObject, senderWhisperKey) => {
  
  const partner = await getPartnerByMessengerKey(senderWhisperKey);
  const { organization } = await getServerSettings();

  const {
    constants: { EdDSASignatures },
    commitments: commitment,
  } = agreementObject;

  const { recipient } = EdDSASignatures;

  // Sender of the Agreement message should be the same as the party that signed the Agreement
  if (agreementObject.constants.zkpPublicKeyOfRecipient === partner.zkpPublicKey) {
    const isSignVerified = await pycryptojs.verify(
      strip0x(agreementObject.constants.zkpPublicKeyOfRecipient),
      strip0x(commitment[0].commitment),
      recipient.R,
      recipient.S,
    );
    console.log('\nAgreement signature verification success');

    if (isSignVerified) {
      const agreementDoc = await updateAgreementWithRecipientSignature(agreementObject);

      const agreement = new Agreement(extractAgreementFromDoc(agreementDoc));

      // keep unused variables here for now; they might be used soon...
      const { transactionHash, leafIndex, leafValue, newRoot } = await createAgreement(agreement);

      agreement.commitment.index = leafIndex;

      await updateAgreementWithCommitmentIndex(agreement.object);

      const commitmentSiblingPath = await getSiblingPathByLeafIndex('Shield', leafIndex);

      const commitSiblingPathTrimmed = commitmentSiblingPath.map(leaf => leaf.value);

      let docToBeSent = {};
      docToBeSent.siblingPath = commitSiblingPathTrimmed;
      docToBeSent.agreementCommitment = agreement.commitment;
      docToBeSent.txHash = transactionHash;
      docToBeSent.leafValue = leafValue;

      msgDeliveryQueue.add({
        documentId: agreement._id,
        senderId: organization.messengerKey,
        recipientId: partner.identity,
        payload: {
          type: 'send_proof',
          ...docToBeSent,
        },
      });

      console.log('\nSent proof to Recipient');

      return agreementObject;
    }
    throw new Error(`Recipient's signature verification failed`);
  } else {
    throw new Error(
      `The public key for signature ${recipient.A} doesn't match with the sender of the Agreement creation message ${partner.zkpPublicKey}`,
    );
  }
};

export const onReceiptProofRecipient = async (proofObject) => {
  const rootOnChain = await getRoot();
  const rootOffChain = proofObject.siblingPath[0];
  if (rootOnChain == rootOffChain) {
    console.log('\nLatest root on chain, ', rootOnChain, 'matches with offchain value', rootOffChain);
  } else {
    throw new Error(
      `Latest root ${rootOnChain} doesnt match with offchain value ${rootOffChain}`
    );
  }

  const rootCheck = await checkRoot(proofObject.agreementCommitment._commitment, proofObject.agreementCommitment._index, proofObject.siblingPath, rootOnChain);
  if (rootCheck == true) {
    console.log('\nRoot verification successful');
  } else {
    throw new Error(
      `Root doesnt match after recalculating based on updated commitment index`
    );
  }
  const shieldContract = await getContractWithWalletByName('Shield');
  const txReceipt = await getTxReceipt(proofObject.txHash);
  const { newCommitment } = await getEventValuesFromTxReceipt(
    'NewCommitment',
    shieldContract,
    txReceipt,
  );

  if (newCommitment == proofObject.leafValue) {
    console.log('\nCommitment value matches with leaf value');
  } else {
    throw new Error(
      `Commitment value from event doesnt match with leaf value on chain`
    );
  }
};

export { Agreement as default };
