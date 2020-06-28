import { getWallet, getAccounts, getSigner } from '../src/utils';
// import Doppelganger from 'ethereum-doppelganger';
import { ethers, utils } from 'ethers';


import OrgRegistryArtifact from '../artifacts/OrgRegistry.json';
import RegistrarArtifact from '../artifacts/Registrar.json';
import ERC1820RegistryArtifact from '../artifacts/ERC1820Registry.json';

const wallet = getWallet();
let orgRegistry, registrar, erc1820Registry;
let accounts, signer;

test('Deploy Org Registration', async () => {
  accounts = await getAccounts();
  signer = await getSigner(accounts[0]);
  let OrgRegistry = new ethers.ContractFactory(OrgRegistryArtifact.compilerOutput.abi,
    OrgRegistryArtifact.compilerOutput.evm.bytecode, signer);
  let Registrar = new ethers.ContractFactory(RegistrarArtifact.compilerOutput.abi,
    RegistrarArtifact.compilerOutput.evm.bytecode, signer);
  let ERC1820Registry = new ethers.ContractFactory(ERC1820RegistryArtifact.compilerOutput.abi,
    ERC1820RegistryArtifact.compilerOutput.evm.bytecode, signer);
  erc1820Registry = await ERC1820Registry.deploy();
  /* 
  // The below lines also show use of doppelganger to be able to mock
  // all inherited contracts, such as ERC1820Registry and Registrar.
  let doppelganger1820 = new Doppelganger(ERC1820RegistryArtifact.compilerOutput.abi);
  await doppelganger1820.deploy(signer); 
  let doppelgangerReg = new Doppelganger(RegistrarArtifact.compilerOutput.abi);
  await doppelgangerReg.deploy(doppelganger1820.address, signer);
  registrar = await Registrar.deploy(erc1820Registry.address);
  orgRegistry = await OrgRegistry.deploy(erc1820Registry.address); */
  registrar = await Registrar.deploy(erc1820Registry.address);
  orgRegistry = await OrgRegistry.deploy(erc1820Registry.address);
  expect(orgRegistry.address).toMatch(new RegExp('^0x[a-fA-F0-9]{40}$'));
});

test('Should be able to set interfaces for compatibility checks', async () => {
  orgRegistry.connect(signer);
  await orgRegistry.setInterfaces();
});

test('Should be able to correctly set the interface id', async () => {
  const x = await orgRegistry.getInterfaces();
  const y = await orgRegistry.supportsInterface(x);
  expect(y).toBe(true);
});

test('Should be able to get 0 count at the beginning', async () => {
  const orgCount = await orgRegistry.getOrgCount();
  expect(orgCount.toNumber()).toBe(0);
});

test('Should be able to register an org', async () => {
  const txReceipt = await orgRegistry.registerOrg(
    accounts[1],
    utils.formatBytes32String("Name"),
    2,
    utils.hexlify('0x0471099dd873dacf9570f147b9e07ebd671e05bfa63912ee623a800ede8a294f7f60a13fadf1b53d681294cc9b9ff0a4abdf47338ff72d3c34c95cdc9328bd0128'),
    utils.hexlify('0x0471099dd873dacf9570f147b9e07ebd671e05bfa63912ee623a800ede8a294f7f60a13fadf1b53d681294cc9b9ff0a4abdf47338ff72d3c34c95cdc9328bd0128')
  );
  const orgCountBefore = await orgRegistry.getOrgCount();
  expect(orgCountBefore.toNumber()).toBe(1);
});

test('Should not be able to register an org from non-owner', async () => {
  const nonOwner = await getSigner(accounts[4]);
  const nonOwnerOrgRegistry = orgRegistry.connect(nonOwner);
  try {
    await nonOwnerOrgRegistry.registerOrg(
      accounts[4],
      utils.formatBytes32String("Name2"),
      2,
      utils.hexlify('0x0471099dd873dacf9570f147b9e07ebd671e05bfa63912ee623a800ede8a294f7f60a13fadf1b53d681294cc9b9ff0a4abdf47338ff72d3c34c95cdc9328bd0128'),
      utils.hexlify('0x0471099dd873dacf9570f147b9e07ebd671e05bfa63912ee623a800ede8a294f7f60a13fadf1b53d681294cc9b9ff0a4abdf47338ff72d3c34c95cdc9328bd0128')
    );
  } catch(e) {
    expect(e.message).toMatch('revert');
    expect(e.message).toMatch('You are not authorised to invoke this function');
    expect(e.code).toBe(-32000);
  }

  const orgCountAfter = await orgRegistry.getOrgCount();
  expect(orgCountAfter.toNumber()).toBe(1);
});

test('Should be able to register an orgs interfaces', async () => {
  const txReceipt = await orgRegistry.registerInterfaces(utils.formatBytes32String("RandomInterface"), accounts[0], accounts[1], accounts[2]);
});

test('Should not be able to register an orgs interfaces from non owner', async () => {
  const nonOwner = await getSigner(accounts[4]);
  const nonOwnerOrgRegistry = orgRegistry.connect(nonOwner);
  try {
    await nonOwnerOrgRegistry.registerInterfaces(utils.formatBytes32String("RandomInterface2"), accounts[0], accounts[1], accounts[2]);
  } catch(e) {
    expect(e.message).toMatch('revert');
    expect(e.message).toMatch('You are not authorised to invoke this function');
    expect(e.code).toBe(-32000);
    return;
  }
  expect(false).toBeTruthy();
});

test('Should be able to get all interface details for an org', async () => {
  const interfaceObjects = await orgRegistry.getInterfaceAddresses();
  const {
    0: names,
    1: tokens,
    2: shields,
    3: verifiers
  } = interfaceObjects;
  expect(names[0]).toBe(utils.formatBytes32String('RandomInterface'));
  expect(tokens[0]).toBe(accounts[0]);
  expect(shields[0]).toBe(accounts[1]);
  expect(verifiers[0]).toBe(accounts[2]);
});

test('Should be able to retrieve the incremented org count', async () => {
  const orgCount = await orgRegistry.getOrgCount();
  expect(orgCount.toNumber()).toBe(1);
});

test('Should be able to retrieve registered org details', async () => {
  const {
    0: address,
    1: name,
    2: role,
    3: messagingKey,
    4: zkpKey
  } = await orgRegistry.getOrgs();
  expect(address[0]).toBe(accounts[1]);
  expect(name[0]).toBe(utils.formatBytes32String('Name'));
  expect(role[0].toNumber()).toBe(2);
  expect(messagingKey[0]).toBe(utils.hexlify('0x0471099dd873dacf9570f147b9e07ebd671e05bfa63912ee623a800ede8a294f7f60a13fadf1b53d681294cc9b9ff0a4abdf47338ff72d3c34c95cdc9328bd0128'));
  expect(zkpKey[0]).toBe(utils.hexlify('0x0471099dd873dacf9570f147b9e07ebd671e05bfa63912ee623a800ede8a294f7f60a13fadf1b53d681294cc9b9ff0a4abdf47338ff72d3c34c95cdc9328bd0128'));
});

test('Should be able to get registrar info', async () => {
  const address = await registrar.interfaceAddr(orgRegistry.address, "IOrgRegistry");
  expect(address).toBe(orgRegistry.address);
});

test('Should be able to assign new manager', async () => {
  await orgRegistry.assignManager(accounts[0]);
  const newManager = await erc1820Registry.getManager(orgRegistry.address);
  expect(newManager).toBe(accounts[0]);

  const newManagerThroughOrgContract = await orgRegistry.getManager();
  expect(newManagerThroughOrgContract).toBe(accounts[0]);
});

test('Should be able to get registrar info as new manager', async () => {
  const out = await erc1820Registry.setInterfaceImplementer(accounts[0], utils.id("IOrgRegistry"), orgRegistry.address);
  const address = await registrar.interfaceAddr(accounts[0], "IOrgRegistry");
  expect(address).toBe(orgRegistry.address);
});
