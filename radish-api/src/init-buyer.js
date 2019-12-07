import { utils } from 'ethers';
import db from './db';
import { getAccounts, getAddress, getBalance } from './services/wallet';
import {
  deployERC1820Registry,
  deployRegistrar,
  deployOrgRegistry,
  getOrganizationRegistryAddress,
} from './services/contract';
import {
  assignManager,
  registerToOrgRegistry,
  setInterfaceImplementer,
  getInterfaceAddress,
  getRegisteredOrganization,
} from './services/organization';

const main = async () => {
  await db.connect();
  console.log('accounts in the network are: ', await getAccounts());
  const walletAddress = await getAddress();
  console.log('the account used in this container is: ', walletAddress);
  console.log('the balance of the account used in this container is: ', await getBalance());
  const returnValue0 = await deployERC1820Registry('ERC1820Registry');
  console.log('data stored in db for ERC1820Registry Smartcontract: ', returnValue0);
  const registrarRecord = await deployRegistrar(returnValue0.contract.contractAddress);
  console.log('data stored in db for Registrar Smartcontract: ', registrarRecord);
  const orgRegistryRecord = await deployOrgRegistry(registrarRecord.contract.contractAddress);
  console.log('data stored in db for OrgRegistry Smartcontract: ', orgRegistryRecord);
  const txHashAssignManager = await assignManager(orgRegistryRecord.contract.contractAddress);
  console.log('transactionHash for assigning new manager of OrgRegistry: ', txHashAssignManager);
  const txHashSetInterfaceImplmenter = await setInterfaceImplementer(
    walletAddress,
    utils.id('IOrgRegistry'),
    orgRegistryRecord.contract.contractAddress,
  );
  console.log(
    'transactionHash for setting IOrgRegistry interface implementer is: ',
    txHashSetInterfaceImplmenter,
  );
  console.log('OrgRegistry Address in db is: ', await getOrganizationRegistryAddress());
  const orgRegistryAddress = await getInterfaceAddress(
    registrarRecord.contract.contractAddress,
    walletAddress,
    'IOrgRegistry',
  );
  console.log('OrgRegistry Address retrieved from Registrar is: ', orgRegistryAddress);
  const registerOrgTxHash = await registerToOrgRegistry(
    walletAddress,
    'Buyer',
    1,
    '0x0471099dd873dacf9570f147b9e07ebd671e05bfa63912ee623a800ede8a294f7f60a13fadf1b53d681294cc9b9ff0a4abdf47338ff72d3c34c95cdc9328bd0128',
  );
  console.log('transactionHash for registering the buyer is: ', registerOrgTxHash);
  const orgRecord = await getRegisteredOrganization(walletAddress);
  console.log('registered organization for this container is: ', orgRecord);
  process.exit(0);
};

main();
