import {
  getWallet,
  getAccounts,
  getSigner,
  getProvider,
  link
} from '../src/utils';
import Doppelganger from 'ethereum-doppelganger';
import {
  ethers,
  utils
} from 'ethers';
import testdata from './mockVerifierData';

import VerifierArtifact from '../artifacts/Verifier.json';
import BN256G2Artifact from '../artifacts/BN256G2.json';
import ERC1820RegistryArtifact from '../artifacts/ERC1820Registry.json';

const SNARK_SCALAR_BOUND = "21888242871839275222246405745257275088548364400416034343698204186575808495617";
const PRIME_BOUND = "21888242871839275222246405745257275088696311157297823662689037894645226208583";
let verifier;
let accounts, signer;

test('Should be able to deploy Verifier contract', async () => {
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
  expect(verifier.address).toMatch(new RegExp('^0x[a-fA-F0-9]{40}$'));
});

test('Should be able to successfully execute verify transaction', async () => {
  // Note: Alternatively, hex inputs from interaction with the zkp service during set up and proof generation
  // can be used. To be able to convert the proof and vk arrays to BigInt, `formatProof` a util in 
  // api/src/utils/crypto/conversions.js can be used to handle this conversion
  let topic = utils.id("Verified(bool)");
  const tx = await verifier.verify(testdata.msa.proofs_int, testdata.msa.inputs_hash, testdata.msa.vks_int);
  await tx.wait();
  const txReceipt = await getProvider().getTransactionReceipt(tx.hash);
  const txLogs = verifier.interface.parseLog(txReceipt.logs[0]);
  expect(tx.confirmations > 0).toBeTruthy();
  expect(txReceipt.status).toEqual(1);
  expect(tx.hash).toMatch(new RegExp('^0x[a-fA-F0-9]{64}$'));
  expect(txLogs.name).toEqual('Verified');
  expect(txLogs.topic).toEqual(topic);
  expect(txLogs.values['0']).toEqual(true);
}, 30000);

test('Should be able to throw when input to verify function overflows snark scalar bound', async () => {
  expect.assertions(2);
  let overflow_input = [];
  overflow_input.push(SNARK_SCALAR_BOUND);
  // Alternately, the scalar bound can be further incremented:
  // overflow_input.push((BigInt(BigInt(SNARK_SCALAR_BOUND) + BigInt(testdata.msa.inputs_hash[0]))).toString());
  try {
    await verifier.verify(testdata.msa.proofs_int, overflow_input, testdata.msa.vks_int);
  } catch (err) {
    expect(err.code).toBe(-32000);
    expect(err.message).toMatch('Input greater than snark scalar field!');
  }
}, 10000);

test('Should be able to throw when proof to verify function overflows prime bound', async () => {
  expect.assertions(2);
  testdata.msa.proofs_int.splice(0, 1, PRIME_BOUND);
  // Alternately, the prime bound can be further incremented:
  // testdata.msa.proofs_int.splice(0,1,(BigInt(BigInt(PRIME_BOUND) + BigInt(testdata.msa.proofs_int[0]))).toString());
  try {
    await verifier.verify(testdata.msa.proofs_int, testdata.msa.inputs_hash, testdata.msa.vks_int);
  } catch (err) {
    expect(err.code).toBe(-32000);
    expect(err.message).toMatch('Proof value aX greater than prime bound!');
  }
}, 10000);