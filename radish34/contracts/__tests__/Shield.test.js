import { getWallet, getAccounts, getSigner, getProvider, link } from '../src/utils';
import Doppelganger from 'ethereum-doppelganger';
import { ethers, utils } from 'ethers';
import testdata from './mockVerifierData';

import VerifierArtifact from '../artifacts/Verifier.json';
import BN256G2Artifact from '../artifacts/BN256G2.json'; 
import ShieldArtifact from '../artifacts/Shield.json';
import MerkleTreeArtifact from '../artifacts/MerkleTree.json'
import ERC1820RegistryArtifact from '../artifacts/ERC1820Registry.json';

const wallet = getWallet();
const SNARK_SCALAR_BOUND = "21888242871839275222246405745257275088548364400416034343698204186575808495617";
const PRIME_BOUND = "21888242871839275222246405745257275088696311157297823662689037894645226208583";
let verifier, shield, merkleTree;
let accounts, signer;

test('Should be able to deploy Shield contract', async () => {
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
