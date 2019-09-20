import { ethers, utils } from 'ethers';
import Doppelganger from 'ethereum-doppelganger';
import { getWallet, getAccounts } from './wallet';

import RegistryArtifact from '../artifacts/Registry';

const wallet = getWallet();
const { compilerOutput: { abi , evm: { bytecode } } } = RegistryArtifact;
const Registry = new ethers.ContractFactory(abi, bytecode, wallet);

let registry;

beforeEach(async () => {
    registry = await Registry.deploy();
    console.log(registry.address);
});

test('at the beginning the count of number of orgs must be 0', async () => {
    const accounts = await getAccounts();
    // const c = await registry.getOrgCount();
    await registry.registerOrg(accounts[1], utils.formatBytes32String("Name"), 2);
    // console.log(c);
    // expect(c).toBe(0);
})