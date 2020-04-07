import { getWallet, getAccounts, getSigner } from '../src/utils';
import { ethers, utils } from 'ethers';


import OrgRegistryArtifact from '../artifacts/OrgRegistry.json';
import ERC1820RegistryArtifact from '../artifacts/ERC1820Registry.json';

let orgRegistry, erc1820Registry;
let accounts, signer;

let ownerA, ownerB, nonOwner;

test('Deploy Org MultiOwnable Contract', async () => {
  accounts = await getAccounts();
  ownerA = await getSigner(accounts[0]);
  ownerB = await getSigner(accounts[1]);
  nonOwner = await getSigner(accounts[2]);
  let OrgRegistry = new ethers.ContractFactory(OrgRegistryArtifact.compilerOutput.abi,
    OrgRegistryArtifact.compilerOutput.evm.bytecode, ownerA);
  let ERC1820Registry = new ethers.ContractFactory(ERC1820RegistryArtifact.compilerOutput.abi,
    ERC1820RegistryArtifact.compilerOutput.evm.bytecode, ownerA);
  erc1820Registry = await ERC1820Registry.deploy();
  orgRegistry = await OrgRegistry.deploy(erc1820Registry.address);
});

test('Should set the deployer as initial owner', async () => {
  const deployerIsOwner = await orgRegistry.isOwner(accounts[0]);
  expect(deployerIsOwner).toBeTruthy();
})

test('Should allow an owner to add owner', async () => {
  await orgRegistry.setOwner(accounts[1]);
  const ownerBisOwner = await orgRegistry.isOwner(accounts[1]);
  expect(ownerBisOwner).toBeTruthy();
})

test('Should not allow nonOwner to add owner', async () => {
  const nonOwnerOrgRegistry = orgRegistry.connect(nonOwner);
  try {
      await nonOwnerOrgRegistry.setOwner(accounts[2])
  } catch (e) {
    expect(e.message).toMatch('revert');
    expect(e.message).toMatch('Unauthorised access: needs to be called by an owner!');
    expect(e.code).toBe(-32000);
  }
})

test('Should not allow nonOwner to call onlyOwner method', async () => {
  const nonOwnerOrgRegistry = orgRegistry.connect(nonOwner);
  try {
      await nonOwnerOrgRegistry.assignManager(accounts[2])
  } catch (e) {
    expect(e.message).toMatch('revert');
    expect(e.message).toMatch('Unauthorised access: needs to be called by an owner!');
    expect(e.code).toBe(-32000);
  }
})

test('Should allow owner to call onlyOwner method', async () => {
  await orgRegistry.assignManager(accounts[1]);
  const manager = await orgRegistry.getManager();
  expect(manager).toBe(accounts[1]);
})
