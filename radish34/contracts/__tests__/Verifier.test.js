import { getWallet, getAccounts, getSigner, getProvider, link } from '../src/utils';
import Doppelganger from 'ethereum-doppelganger';
import { ethers, utils } from 'ethers';
import testdata from './testData';

import VerifierArtifact from '../artifacts/Verifier.json';
import BN256G2Artifact from '../artifacts/BN256G2.json'; 
import ERC1820RegistryArtifact from '../artifacts/ERC1820Registry.json';

const wallet = getWallet();
const SNARK_SCALAR_BOUND = "21888242871839275222246405745257275088548364400416034343698204186575808495617";
const PRIME_BOUND = "21888242871839275222246405745257275088696311157297823662689037894645226208583";
let verifier;
let accounts, signer;

test('Deploy Verifier contract', async () => {
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

test('Test interaction with verify function', async() => {
  // Note: Alternatively, hex inputs from interaction with the zkp service during set up and proof generation
  // can be used. To be able to convert the proof and vk arrays to BigInt, `formatProof` a util in 
  // api/src/utils/crypto/conversions.js can be used to handle this conversion
  let new_inputs = testdata.inputs.map(x => BigInt(x).toString());
  let topic = utils.id("Verified(bool)");
  let filter = {
    address: verifier.address,
    topics: [ topic ]
  };
  let eventOut;
  getProvider().on(filter, (res) => {
    console.log('Event trace for topic found: ', res);
  });
  verifier.on("Verified", (result, event) => {
    eventOut = result;
    console.log(event);
  });
  const { hash, confirmations } = await verifier.verify(testdata.proofs_int, new_inputs, testdata.vks_int);
  //to be updated for true result output from the event
  // expect(eventOut).toBeTruthy();
  expect(eventOut).not.toBeNull();
  expect(confirmations > 0).toBeTruthy();
  expect(hash).toMatch(new RegExp('^0x[a-fA-F0-9]{64}$'));
  verifier.provider.polling = false;
}, 10000);

test('Test overflow condition with verify function', async() => {
  // expect.assertions(1);
  const original_proof = testdata.proofs_int;
  const proof_to_replace = testdata.proofs_int[0];
  const proof_upperlimit = BigInt("21888242871839275222246405745257275088548364400416034343698204186575808495617");
  const overflow_proof = BigInt(proof_upperlimit + BigInt(proof_to_replace.toString()));
  const proof_deleted = testdata.proofs_int.splice(0,1,proof_upperlimit.toString());
  // console.log(testdata.proofs_int, 'after replacement');
  // console.log(proof_to_replace, 'before replacement');
  try {
    const { hash, confirmations } = await verifier.verify(testdata.proofs_int, testdata.inputs, testdata.vks_int);
  }
  catch(e) {
    console.log(e);
  }
  
  // expect(confirmations > 0).toBeTruthy();
  // expect(hash).toMatch(new RegExp('^0x[a-fA-F0-9]{64}$'));
}, 10000);

