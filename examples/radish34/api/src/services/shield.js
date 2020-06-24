import { getEventValuesFromTxReceipt } from '../utils/ethers';
import { hexToDec, flattenDeep } from '../utils/crypto/conversions';
import { getTxReceipt, getContractWithWalletByName } from './contract';

/**
 * Converts a proof object to a flattened array of integers (field elements).
 *
 * @param {object} proofObject - elliptic curve points - in the format provided by the zkp service.
 * @returns {string} - the proof
 */
export const formatProof = proofObject => {
  let proof = Object.values(proofObject);
  // convert to flattened array:
  proof = flattenDeep(proof);
  // convert to decimal, as the solidity functions expect a proof to be am array of uints
  proof = proof.map(el => hexToDec(el));
  return proof;
};

/**
 * Log stats relating to the gas used in both the verifier contract, and the shield contract.
 *
 * @param {string} functionName - function for calculating stats
 * @param {string} shieldContract - shield contract
 * @param {string} txReceipt - transaction receipt
 */
const gasUsedStats = (functionName, shieldContract, txReceipt) => {
  console.group(`\nGas used in ${functionName}:`);
  const { gasUsed } = txReceipt;
  const { byShieldContract, byVerifierContract } = getEventValuesFromTxReceipt(
    'GasUsed',
    shieldContract,
    txReceipt,
  );
  const refund = byVerifierContract + byShieldContract - gasUsed;
  console.log('Total:', gasUsed.toNumber());
  console.log('By shield contract:', byShieldContract);
  console.log('By verifier contract (pre refund):', byVerifierContract);
  console.log('Refund:', refund);
  console.log('Attributing all of refund to the verifier contract...');
  console.log('By verifier contract (post refund):', byVerifierContract - refund);
  console.groupEnd();
};

/**
 * @param {string[]} proof - Array of private fields for the proof
 * @param {string} publicInputHash - The public side of the hash
 * @param {string[]} publicInputs - Other public proof fields
 */
export const createMSA = async (proof, publicInputHash, publicInputs) => {
  console.log('\nCreating MSA within the shield contract');
  console.log('proof:');
  console.log(proof);
  console.log('publicInputHash:');
  console.log(publicInputHash);
  console.log('publicInputs:');
  console.log(publicInputs);

  const shieldContract = await getContractWithWalletByName('Shield');
  const overrides = {
    // The maximum units of gas for the transaction to use
    gasLimit: 10000000,
  };
  const tx = await shieldContract.createMSA(proof, publicInputHash, ...publicInputs, overrides);
  // The operation is NOT complete yet; we must wait until it is mined
  await tx.wait();
  const txReceipt = await getTxReceipt(tx.hash);

  const { leafIndex, leafValue, root: newRoot } = getEventValuesFromTxReceipt(
    'NewLeaf',
    shieldContract,
    txReceipt,
  );

  gasUsedStats('createMSA', shieldContract, txReceipt);

  return {
    transactionHash: tx.hash,
    leafIndex,
    leafValue,
    newRoot,
  };
};

// TO DO: Consolidate function calls for createAgreement and createMSA
export const createAgreement = async (proof, publicInputHash, publicInputs) => {
  console.log('\nCreating Agreement within the shield contract');
  console.log('proof:');
  console.log(proof);
  console.log('publicInputHash:');
  console.log(publicInputHash);
  console.log('publicInputs:');
  console.log(publicInputs);

  const shieldContract = await getContractWithWalletByName('Shield');
  const overrides = {
    // The maximum units of gas for the transaction to use
    gasLimit: 10000000,
  };
  const tx = await shieldContract.createAgreement(proof, publicInputHash, ...publicInputs, overrides);
  // The operation is NOT complete yet; we must wait until it is mined
  await tx.wait();
  const txReceipt = await getTxReceipt(tx.hash);

  const { leafIndex, leafValue, root: newRoot } = getEventValuesFromTxReceipt(
    'NewLeaf',
    shieldContract,
    txReceipt,
  );

  gasUsedStats('createMSA', shieldContract, txReceipt);

  return {
    transactionHash: tx.hash,
    leafIndex,
    leafValue,
    newRoot,
  };
};

/**
@param {string[]} proof - Array of private fields for the proof
@param {string} publicInputHash - The public side of the hash
@param {string[]} publicInputs - Other public proof fields  
 */
export const createPO = async (proof, publicInputHash, publicInputs) => {
  console.log('\nCreating PO within the shield contract');
  console.log('proof:');
  console.log(proof);
  console.log('publicInputHash:');
  console.log(publicInputHash);
  console.log('publicInputs:');
  console.log(publicInputs);

  const shieldContract = await getContractWithWalletByName('Shield');
  const overrides = {
    // The maximum units of gas for the transaction to use
    gasLimit: 10000000,
  };
  const tx = await shieldContract.createPO(proof, publicInputHash, ...publicInputs, overrides);
  // The operation is NOT complete yet; we must wait until it is mined
  await tx.wait();
  const txReceipt = await getTxReceipt(tx.hash);

  const { minLeafIndex, leafValues, root: newRoot } = getEventValuesFromTxReceipt(
    'NewLeaves',
    shieldContract,
    txReceipt,
  );

  // TODO: How does a dynamic array (emitted as an event parameter) get formatted into an ethers transaction log
  const newMSALeafIndex = minLeafIndex;
  const newPOLeafIndex = minLeafIndex + 1;

  const newMSALeafValue = leafValues[0];
  const newPOLeafValue = leafValues[1];

  gasUsedStats('createMSA', shieldContract, txReceipt);

  return {
    transactionHash: tx.hash,
    newMSALeafIndex,
    newPOLeafIndex,
    newMSALeafValue,
    newPOLeafValue,
    newRoot,
  };
};

export default {
  createMSA,
  createPO,
  formatProof,
};
