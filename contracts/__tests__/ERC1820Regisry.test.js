import { ethers, utils } from 'ethers';
import { getWallet, getAccounts, getSigner } from '../wallet';
import ERC1820RegistryArtifact from '../../artifacts/ERC1820Registry.json';
import OrgRegistryArtifact from '../../artifacts/OrgRegistry.json';
import { register } from 'ethers/utils/wordlist';

const wallet = getWallet();

let accounts, signer, orgRegistry, erc1820Registry;

// var compilerOutput = { abi , evm: { bytecode } } = ERC1820RegistryArtifact;
// console.log(compilerOutput);
// const ERC1820Registry = new ethers.ContractFactory(abi, bytecode, wallet);
const { compilerOutput: { abi , evm: { bytecode } } } = ERC1820RegistryArtifact;
// const { compilerOutput: { abi , evm: { bytecode } } } = OrgRegistryArtifact;
let ERC1820Registry = new ethers.ContractFactory(ERC1820RegistryArtifact.compilerOutput.abi, 
    ERC1820RegistryArtifact.compilerOutput.evm.bytecode, wallet);
let OrgRegistry = new ethers.ContractFactory(OrgRegistryArtifact.compilerOutput.abi, 
    OrgRegistryArtifact.compilerOutput.evm.bytecode, wallet);

beforeAll(async () => {
    accounts = await getAccounts();
    signer = await getSigner(accounts[0]);
    ERC1820Registry = new ethers.ContractFactory(ERC1820RegistryArtifact.compilerOutput.abi, 
        ERC1820RegistryArtifact.compilerOutput.evm.bytecode, signer);
    OrgRegistry = new ethers.ContractFactory(OrgRegistryArtifact.compilerOutput.abi, 
        OrgRegistryArtifact.compilerOutput.evm.bytecode, signer);
    erc1820Registry = await ERC1820Registry.deploy();
    orgRegistry = await OrgRegistry.deploy();
    // erc1820Registry = await ERC1820Registry.deploy();
    console.log('ERC1820Registry: ', erc1820Registry.address, 'OrgRegistry: ', orgRegistry.address);
});

test('Setting the manager', async () => {
    const iLabel = await orgRegistry.getInterfaces();
    const tx = await erc1820Registry.setManager(accounts[0], accounts[0]);
    console.log("Setting the manager for the ERC1820Registry", tx);
    const mgr = await erc1820Registry.getManager(accounts[0]);
    console.log('Manager for the ERC1820Registry is:', mgr);
    // const itx = await erc1820Registry.setInterfaceImplementer(erc1820Registry.address, utils.keccak256(iLabel), orgRegistry.address);
    // console.log("Setting an implementer for the ERC1820Registry", itx);
});

test('Interact with the Org contract to get the count', async () => {
    const orgCount = await orgRegistry.getOrgCount();
    console.log('At the beginning the org count is: ', orgCount);
    expect(orgCount.toNumber()).toBe(0);
})