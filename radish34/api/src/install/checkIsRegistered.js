import { getRegisteredOrganization } from '../services/organization';
import { getWallet } from '../utils/wallet';

export default async () => {
  const wallet = await getWallet();
  const orgInfo = await getRegisteredOrganization(wallet.signingKey.address);

  if (orgInfo.role) {
    console.log('Your organization has already been registered with the registry');
    return true;
  }
  console.log('You have not yet registered your organization with the registry');
  return false;
};
