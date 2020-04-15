import { getAccounts, getSigner, getProvider, link } from '../src/utils';
import Doppelganger from 'ethereum-doppelganger';
import { ethers, utils } from 'ethers';
import testdata from './mockVerifierData';

import VerifierArtifact from '../artifacts/Verifier.json';
import BN256G2Artifact from '../artifacts/BN256G2.json';
import ShieldArtifact from '../artifacts/Shield.json';
import ERC1820RegistryArtifact from '../artifacts/ERC1820Registry.json';

let verifier, shield;
let accounts, signer;
const overrides = { gasLimit: 10000000 }; // The maximum units of gas for the transaction to use

test('Successfully deploys Shield contract', async () => {
  accounts = await getAccounts();
  signer = await getSigner(accounts[0]);
  let BN256G2 = new ethers.ContractFactory(BN256G2Artifact.compilerOutput.abi,
    BN256G2Artifact.compilerOutput.evm.bytecode, signer);
  const bn256g2Address = await BN256G2.deploy();
  let Verifier = new ethers.ContractFactory(VerifierArtifact.compilerOutput.abi,
    link(VerifierArtifact.compilerOutput.evm.bytecode, 'BN256G2', bn256g2Address.address), signer);
  let doppelganger = new Doppelganger(ERC1820RegistryArtifact.compilerOutput.abi);
  await doppelganger.deploy(signer);
  verifier = await Verifier.deploy(doppelganger.address);
  let Shield = new ethers.ContractFactory(ShieldArtifact.compilerOutput.abi,
    ShieldArtifact.compilerOutput.evm.bytecode, signer);
  // console.log(verifier.address);
  shield = await Shield.deploy(verifier.address, doppelganger.address);
  expect(verifier.address).toMatch(new RegExp('^0x[a-fA-F0-9]{40}$'));
  expect(shield.address).toMatch(new RegExp('^0x[a-fA-F0-9]{40}$'));
});

test('Successful registerVerificationKey transaction for createMSA', async () => {
  // Note: Alternatively, hex inputs from interaction with the zkp service during set up and proof generation
  // can be used. To be able to convert the proof and vk arrays to BigInt, `formatProof` a util in 
  // api/src/utils/crypto/conversions.js can be used to handle this conversion
  let topic = utils.id("VkChanged(uint8)");
  const tx = await shield.registerVerificationKey(testdata.msa.vks_int, 0);
  await tx.wait();
  const txReceipt = await getProvider().getTransactionReceipt(tx.hash);
  const txLogs = shield.interface.parseLog(txReceipt.logs[0]);
  expect(tx.confirmations > 0).toBeTruthy();
  expect(txReceipt.status).toEqual(1);
  expect(tx.hash).toMatch(new RegExp('^0x[a-fA-F0-9]{64}$'));
  expect(txLogs.name).toEqual('VkChanged');
  expect(txLogs.topic).toEqual(topic);
}, 20000);

test('Successful createMSA transaction', async () => {
  // Note: Alternatively, hex inputs from interaction with the zkp service during set up and proof generation
  // can be used. To be able to convert the proof and vk arrays to BigInt, `formatProof` a util in 
  // api/src/utils/crypto/conversions.js can be used to handle this conversion
  let topic = utils.id("NewLeaf(uint256,bytes32,bytes32)");
  const tx = await shield.createMSA(testdata.msa.proofs_int, testdata.msa.inputs_hash, ...testdata.msa.inputs_hex, overrides);
  await tx.wait(); // The operation is NOT complete yet; we must wait until it is mined
  const txReceipt = await getProvider().getTransactionReceipt(tx.hash);
  const txLogs = shield.interface.parseLog(txReceipt.logs[1]);
  const merkleRoot = txLogs.values.root;
  expect(tx.confirmations > 0).toBeTruthy();
  expect(txReceipt.status).toEqual(1);
  expect(tx.hash).toMatch(new RegExp('^0x[a-fA-F0-9]{64}$'));
  expect(txLogs.name).toEqual('NewLeaf');
  expect(txLogs.topic).toEqual(topic);
  expect(merkleRoot).toMatch(new RegExp('^0x[a-fA-F0-9]{64}$'));
}, 20000);

test('Rejects createPO tx if verificationKey has not been registered', async () => {
  try {
    await shield.createPO(
      testdata.po.proofs_int,
      testdata.po.inputs_hash,
      ...testdata.po.inputs_hex,
      overrides
    );
  }
  catch (err) {
    expect(err.code).toBe(-32000);
    return;
  }
  expect(false).toBeTruthy();
}, 20000);

test('Successful registerVerificationKey transaction for createPO', async () => {
  // Note: Alternatively, hex inputs from interaction with the zkp service during set up and proof generation
  // can be used. To be able to convert the proof and vk arrays to BigInt, `formatProof` a util in 
  // api/src/utils/crypto/conversions.js can be used to handle this conversion
  let topic = utils.id("VkChanged(uint8)");
  const tx = await shield.registerVerificationKey(testdata.po.vks_int, 1);
  await tx.wait();
  const txReceipt = await getProvider().getTransactionReceipt(tx.hash);
  const txLogs = shield.interface.parseLog(txReceipt.logs[0]);
  expect(tx.confirmations > 0).toBeTruthy();
  expect(txReceipt.status).toEqual(1);
  expect(tx.hash).toMatch(new RegExp('^0x[a-fA-F0-9]{64}$'));
  expect(txLogs.name).toEqual('VkChanged');
  expect(txLogs.topic).toEqual(topic);
}, 20000);

test('Rejects createPO tx if inputs_hash is wrong', async () => {
  try {
    await shield.createPO(
      testdata.po.proofs_int,
      testdata.msa.inputs_hash,
      ...testdata.po.inputs_hex,
      overrides
    );
  }
  catch (err) {
    expect(err.code).toBe(-32000);
    expect(err.message).toMatch('publicInputHash cannot be reconciled');
    return;
  }
  expect(false).toBeTruthy();
}, 20000);

test('Successful createPO transaction', async () => {
  let topic = utils.id("NewLeaves(uint256,bytes32[],bytes32)");
  let topic2 = utils.id("UpdatedCommitment(bytes32,bytes32)");

  const tx = await shield.createPO(
    testdata.po.proofs_int,
    testdata.po.inputs_hash,
    ...testdata.po.inputs_hex,
    overrides
  );
  await tx.wait(); // The operation is NOT complete yet; we must wait until it is mined
  const txReceipt = await getProvider().getTransactionReceipt(tx.hash);
  const txLogs = shield.interface.parseLog(txReceipt.logs[1]);
  const txLogs2 = shield.interface.parseLog(txReceipt.logs[2]);
  expect(tx.confirmations > 0).toBeTruthy();
  expect(txReceipt.status).toEqual(1);
  expect(tx.hash).toMatch(new RegExp('^0x[a-fA-F0-9]{64}$'));
  expect(txLogs.name).toEqual('NewLeaves');
  expect(txLogs.topic).toEqual(topic);
  expect(txLogs2.name).toEqual('UpdatedCommitment');
  expect(txLogs2.topic).toEqual(topic2);
}, 20000);

test('Rejects redundant createPO tx', async () => {
  try {
    await shield.createPO(
      testdata.po.proofs_int,
      testdata.po.inputs_hash,
      ...testdata.po.inputs_hex,
      overrides
    );
  }
  catch (err) {
    expect(err.code).toBe(-32000);
    expect(err.message).toMatch('The MSA commitment (which is being updated) has already been nullified!');
    return;
  }
  expect(false).toBeTruthy();
}, 20000);

