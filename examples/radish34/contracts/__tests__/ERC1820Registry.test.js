import { ethers, utils } from 'ethers';
import { getWallet, getAccounts, getSigner } from '../src/utils';
import ERC1820RegistryArtifact from '../artifacts/ERC1820Registry.json';
import SampleERC1820ImplementerArtifact from '../artifacts/SampleERC1820Implementer.json';

const wallet = getWallet();
const NULL_ADDRESS = "0x0000000000000000000000000000000000000000";

let accounts, signer, sampleImplementer, erc1820Registry, iHash;
let ERC1820Registry;
let SampleERC1820Implementer;

describe('ERC1820 Registry tests', () => {

  beforeAll(async () => {
    accounts = await getAccounts();
    signer = await getSigner(accounts[0]);
    SampleERC1820Implementer = new ethers.ContractFactory(SampleERC1820ImplementerArtifact.abi,
      SampleERC1820ImplementerArtifact.bytecode, signer);
    ERC1820Registry = new ethers.ContractFactory(ERC1820RegistryArtifact.abi,
      ERC1820RegistryArtifact.bytecode, signer);
    erc1820Registry = await ERC1820Registry.deploy();
    sampleImplementer = await SampleERC1820Implementer.deploy();
    expect(erc1820Registry.address).toMatch(new RegExp('^0x[a-fA-F0-9]{40}$'));
    expect(sampleImplementer.address).toMatch(new RegExp('^0x[a-fA-F0-9]{40}$'));
  });

  test("Should be able to set the interface hash", async () => {
    iHash = await erc1820Registry.interfaceHash("TestInterface");
    expect(iHash).toBe(utils.id("TestInterface"));
  });

  test("Should be able to set an implementer address", async () => {
    const iImplementer = await erc1820Registry.setInterfaceImplementer(accounts[0], iHash, sampleImplementer.address);
    expect(iImplementer).toBeDefined();
  });

  test("Should be able to get the implementer address", async () => {
    const retImplementer = await erc1820Registry.getInterfaceImplementer(accounts[0], iHash);
    expect(retImplementer).toBe(sampleImplementer.address);
  });

  test("Should be able to remove interface", async () => {
    const iImplementer = await erc1820Registry.setInterfaceImplementer(accounts[0], iHash, NULL_ADDRESS);
    expect(iImplementer).toBeDefined();
  });

  test("Should be able to get the updated implementer address", async () => {
    const retImplementer = await erc1820Registry.getInterfaceImplementer(accounts[0], iHash);
    expect(retImplementer).toBe(NULL_ADDRESS);
  });

  test("Should be able to change manager", async () => {
    const mgr = await erc1820Registry.setManager(accounts[0], accounts[1]);
    expect(mgr).toBeDefined();
  });

  test("Should be able to get the changed manager", async () => {
    const mgrAddress = await erc1820Registry.getManager(accounts[0]);
    expect(mgrAddress).toBe(accounts[1]);
  });
});
