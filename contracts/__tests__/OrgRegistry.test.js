import { ethers, utils } from 'ethers';
import { getWallet, getAccounts, getSigner } from '../wallet';
import OrgRegistryArtifact from '../../artifacts/OrgRegistry.json';
import RegistrarArtifact from '../../artifacts/Registrar.json';
import ERC1820RegistryArtifact from '../../artifacts/ERC1820Registry.json';

const wallet = getWallet();

let accounts, signer, orgRegistry, registrar, erc1820Registry;

let OrgRegistry, Registrar, ERC1820Registry;

describe('Org Registry tests', () => {
    beforeAll(async () => {
        accounts = await getAccounts();
        signer = await getSigner(accounts[0]);
        ERC1820Registry = new ethers.ContractFactory(ERC1820RegistryArtifact.compilerOutput.abi, 
            ERC1820RegistryArtifact.compilerOutput.evm.bytecode, signer);
        erc1820Registry = await ERC1820Registry.deploy();
        OrgRegistry = new ethers.ContractFactory(OrgRegistryArtifact.compilerOutput.abi, 
            OrgRegistryArtifact.compilerOutput.evm.bytecode, signer);
        orgRegistry = await OrgRegistry.deploy();
        Registrar = new ethers.ContractFactory(RegistrarArtifact.compilerOutput.abi, 
            RegistrarArtifact.compilerOutput.evm.bytecode, signer);
        registrar = await Registrar.deploy(erc1820Registry.address);
        expect(erc1820Registry.address).toMatch(new RegExp('^0x[a-fA-F0-9]{40}$'));
        expect(orgRegistry.address).toMatch(new RegExp('^0x[a-fA-F0-9]{40}$'));
        expect(registrar.address).toMatch(new RegExp('^0x[a-fA-F0-9]{40}$'));
        console.log('OrgRegistry: ', orgRegistry.address);
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
    
    test('Should be able to register an org and retrieve the event', async () => {
        const txReceipt = await orgRegistry.registerOrg(accounts[1], utils.formatBytes32String("Name"), 2, utils.hexlify('0x0471099dd873dacf9570f147b9e07ebd671e05bfa63912ee623a800ede8a294f7f60a13fadf1b53d681294cc9b9ff0a4abdf47338ff72d3c34c95cdc9328bd0128'));
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
            3: key
        } = await orgRegistry.getOrgs(0, 1);
        expect(address[0]).toBe(accounts[1]);
        expect(name[0]).toBe(utils.formatBytes32String('Name'));
        expect(role[0].toNumber()).toBe(2);
        expect(key[0]).toBe(utils.hexlify('0x0471099dd873dacf9570f147b9e07ebd671e05bfa63912ee623a800ede8a294f7f60a13fadf1b53d681294cc9b9ff0a4abdf47338ff72d3c34c95cdc9328bd0128'));
    });
});
