import { ethers, utils } from 'ethers';
import { getWallet, getAccounts } from '../wallet';
import RegistryArtifact from '../../artifacts/OrgRegistry.json';

const wallet = getWallet();

const { compilerOutput: { abi , evm: { bytecode } } } = RegistryArtifact;
const Registry = new ethers.ContractFactory(abi, bytecode, wallet);

let registry;

beforeAll(async () => {
    registry = await Registry.deploy();
});

test('Should be able to set interfaces for compatibility checks', async () => {
    await registry.setInterfaces();
});

test('Should be able to correctly set the interface id', async () => {
    // const c1 = utils.hexDataSlice(utils.keccak256(utils.toUtf8Bytes('registerOrg(address,bytes32,uint,bytes32)')), 0, 4);
    // const c2 = utils.hexDataSlice(utils.keccak256(utils.toUtf8Bytes('getOrgCount()')), 0, 4);
    // const c3 = utils.hexDataSlice(utils.keccak256(utils.toUtf8Bytes('getOrgs(uint,uint)')), 0, 4);
    const x = await registry.getInterfaces();
    const y = await registry.supportsInterface(x);
    expect(y).toBe(true);
});

test('Should be able to get 0 count at the beginning', async () => {
    const orgCount = await registry.getOrgCount();
    expect(orgCount.toNumber()).toBe(0);
});

test('Should be able to register an org and retrieve the event', async () => {
    const accounts = await getAccounts();
    const txReceipt = await registry.registerOrg(accounts[1], utils.formatBytes32String("Name"), 2, utils.hexlify('0x0471099dd873dacf9570f147b9e07ebd671e05bfa63912ee623a800ede8a294f7f60a13fadf1b53d681294cc9b9ff0a4abdf47338ff72d3c34c95cdc9328bd0128'));
});

test('Should be able to retrieve the incremented org count', async () => {
    const orgCount = await registry.getOrgCount();
    expect(orgCount.toNumber()).toBe(1);
});

test('Should be able to retrieve registered org details', async () => {
    const accounts = await getAccounts();
    const {
        0: address, 
        1: name, 
        2: role, 
        3: key
    } = await registry.getOrgs(0, 1);
    expect(address[0]).toBe(accounts[1]);
    expect(name[0]).toBe(utils.formatBytes32String('Name'));
    expect(role[0].toNumber()).toBe(2);
    expect(key[0]).toBe(utils.hexlify('0x0471099dd873dacf9570f147b9e07ebd671e05bfa63912ee623a800ede8a294f7f60a13fadf1b53d681294cc9b9ff0a4abdf47338ff72d3c34c95cdc9328bd0128'));
});
