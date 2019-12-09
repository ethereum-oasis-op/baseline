import db from './db';
import { getAccounts, getAddress, getBalance } from './services/wallet';
import { getOrganizationRegistryAddress } from './services/contract';
import {
  registerToOrgRegistry,
  getInterfaceAddress,
  getRegisteredOrganization,
} from './services/organization';
import { getServerSettings, setOrganizationRegistryAddress } from './utils/serverSettings';

const main = async () => {
  await db.connect();
  const config = await getServerSettings();
  console.log('config are: ', config);
  console.log('accounts in the network are: ', await getAccounts());
  const walletAddress = await getAddress();
  console.log('the account used in this container is: ', walletAddress);
  console.log('the balance of the account used in this container is: ', await getBalance());
  const orgRegistryAddress = await getInterfaceAddress(
    config.registrarAddress,
    config.buyerAddress,
    'IOrgRegistry',
  );
  console.log('OrgRegistry Address retrieved from Registrar is: ', orgRegistryAddress);
  await setOrganizationRegistryAddress(orgRegistryAddress);
  console.log(
    'config.organizationRegistryAddress is set to: ',
    await getOrganizationRegistryAddress(),
  );
  const registerOrgTxHash = await registerToOrgRegistry(
    walletAddress,
    config.myOrganizationName,
    config.myOrganizationRole,
    config.myOrganizationKey,
  );
  console.log('transactionHash for registering the supplier is: ', registerOrgTxHash);
  const orgRecord = await getRegisteredOrganization(walletAddress);
  console.log('registered organization for this container is: ', orgRecord);
  process.exit(0);
};

main();
