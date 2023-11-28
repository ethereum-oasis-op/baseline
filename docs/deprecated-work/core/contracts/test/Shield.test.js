import { getAccounts, getSigner, getProvider } from './utils';
import { ethers, utils } from 'ethers';

import ShieldArtifact from '../artifacts/Shield.json';
import VerifierArtifact from '../artifacts/VerifierNoop.json';

const treeHeight = 4;
let verifier, shield;
let accounts, signer;
let root;

test('Deploy Verifier contract', async () => {
  accounts = await getAccounts();
  signer = await getSigner(accounts[0]);
  const Verifier = new ethers.ContractFactory(VerifierArtifact.abi, VerifierArtifact.bytecode, signer);
  verifier = await Verifier.deploy();
  expect(verifier.address).toMatch(new RegExp('^0x[a-fA-F0-9]{40}$'));
});

test('Deploy Shield contract', async () => {
  const Shield = new ethers.ContractFactory(ShieldArtifact.abi, ShieldArtifact.bytecode, signer);
  shield = await Shield.deploy(verifier.address, treeHeight);
  expect(shield.address).toMatch(new RegExp('^0x[a-fA-F0-9]{40}$'));
});

test('getVerifier() from Shield contract', async () => {
  const verifierAddress = await shield.getVerifier();
  expect(verifierAddress).toEqual(verifier.address);
});

test('Should not be able insertLeaf directly', async () => {
  let error = false;
  try {
    await shield.insertLeaf();
  } catch (err) {
    error = true;
  }
  expect(error).toEqual(true);
});

test('1st verifyAndPush() transaction', async () => {
  const newLeafEvent = utils.id("NewLeaf(uint256,bytes32,bytes32)");
  const proof = [5];
  const publicInputs = ["0x02d449a31fbb267c8f352e9968a79e3e5fc95c1bbeaa502fd6454ebde5a4bedc"]; // Sha256 hash of new commitment
  const newCommitment = "0x1111111111111111111111111111111111111111111111111111111111111111";
  const tx = await shield.verifyAndPush(proof, publicInputs, newCommitment);
  await tx.wait();
  const txReceipt = await getProvider().getTransactionReceipt(tx.hash);
  const txLogs_0 = shield.interface.parseLog(txReceipt.logs[0]);
  expect(tx.confirmations > 0).toBeTruthy();
  expect(txReceipt.status).toEqual(1);
  expect(tx.hash).toMatch(new RegExp('^0x[a-fA-F0-9]{64}$'));
  expect(txLogs_0.name).toEqual('NewLeaf');
  expect(txLogs_0.topic).toEqual(newLeafEvent);
  root = txLogs_0.values.root;
  expect(root).toMatch(new RegExp('^0x[a-fA-F0-9]{64}$'));
}, 20000);

test('2nd verifyAndPush() transaction', async () => {
  const newLeafEvent = utils.id("NewLeaf(uint256,bytes32,bytes32)");
  const proof = [5];
  const publicInputs = ["0x9f72ea0cf49536e3c66c787f705186df9a4378083753ae9536d65b3ad7fcddc4"]; // Sha256 hash of new commitment
  const newCommitment = "0x2222222222222222222222222222222222222222222222222222222222222222";
  const tx = await shield.verifyAndPush(proof, publicInputs, newCommitment);
  await tx.wait();
  const txReceipt = await getProvider().getTransactionReceipt(tx.hash);
  const txLogs_0 = shield.interface.parseLog(txReceipt.logs[0]);
  expect(tx.confirmations > 0).toBeTruthy();
  expect(txReceipt.status).toEqual(1);
  expect(tx.hash).toMatch(new RegExp('^0x[a-fA-F0-9]{64}$'));
  expect(txLogs_0.name).toEqual('NewLeaf');
  expect(txLogs_0.topic).toEqual(newLeafEvent);
  const newRoot = txLogs_0.values.root;
  expect(newRoot).toMatch(new RegExp('^0x[a-fA-F0-9]{64}$'));
  expect(newRoot).not.toEqual(root);
});

test('verifyAndPush() fails with invalid proof', async () => {
  let error = false;
  const proof = [0];
  const publicInputs = ["0x9f72ea0cf49536e3c66c787f705186df9a4378083753ae9536d65b3ad7fcddc4"]; // Sha256 hash of new commitment
  const newCommitment = "0x3333333333333333333333333333333333333333333333333333333333333333";
  try {
    const tx = await shield.verifyAndPush(proof, publicInputs, newCommitment);
    await tx.wait();
  } catch (err) {
    error = true;
  }
  expect(error).toEqual(true);
});
