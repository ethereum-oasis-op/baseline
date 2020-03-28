import { getWallet, getAccounts, getSigner, link, formatProof } from '../src/utils';
import Doppelganger from 'ethereum-doppelganger';
import { ethers, utils } from 'ethers';
import testdata from './testData';
import bigNumber from 'big-integer';

import VerifierArtifact from '../artifacts/Verifier.json';
import BN256G2Artifact from '../artifacts/BN256G2.json'; 
import ERC1820RegistryArtifact from '../artifacts/ERC1820Registry.json';

const wallet = getWallet();
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

test('Check verify function', async() => {
    const p = await formatProof(testdata.proofs);
    const i = testdata.inputs;
    const v = testdata.vks;
    console.log(p, "after integer conversion");
    console.log(testdata.proofs, "before integer conversion");
    //await verifier.verify(testdata.proofs, testdata.inputs, testdata.vks);
    await verifier.verify(p, i, v);
});

