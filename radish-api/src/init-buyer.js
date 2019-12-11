import { utils } from 'ethers';
import db from './db';
import { getAccounts, getAddress, getBalance } from './services/wallet';
import {
  deployERC1820Registry,
  deployOrgRegistry,
  getOrganizationRegistryAddress,
} from './services/contract';
import {
  assignManager,
  registerToOrgRegistry,
  setInterfaceImplementer,
  getInterfaceAddress,
  getRegisteredOrganization,
  getManager,
} from './services/organization';
import { getServerSettings } from './utils/serverSettings';

const main = async () => {
  await db.connect();
  const config = await getServerSettings();
  console.log('accounts in the network are: ', await getAccounts());
  const walletAddress = await getAddress();
  console.log('the account used in this container is: ', walletAddress);
  console.log('the balance of the account used in this container is: ', await getBalance());
  const erc1820Record = await deployERC1820Registry('ERC1820Registry');
  console.log('data stored in db for ERC1820Registry Smartcontract: ', erc1820Record);
  const orgRegistryRecord = await deployOrgRegistry(erc1820Record.contract.contractAddress);
  console.log('data stored in db for OrgRegistry Smartcontract: ', orgRegistryRecord);
  const txHashAssignManager = await assignManager(
    orgRegistryRecord.contract.contractAddress,
    walletAddress,
  );
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
    erc1820Record.contract.contractAddress,
    walletAddress,
    utils.id('IOrgRegistry'),
  );
  console.log('OrgRegistry Address retrieved from Registrar is: ', orgRegistryAddress);
  const registerOrgTxHash = await registerToOrgRegistry(
    orgRegistryAddress,
    walletAddress,
    config.myOrganizationName,
    config.myOrganizationRole,
    config.myOrganizationKey,
  );
  console.log('transactionHash for registering the buyer is: ', registerOrgTxHash);
  const orgRecord = await getRegisteredOrganization(orgRegistryAddress, walletAddress);
  console.log('registered organization for this container is: ', orgRecord);
  process.exit(0);
};

main();
