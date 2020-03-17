import { setOrganizationServerSetting } from '../db/models/baseline/server/settings';
import { getWallet } from '../wallet';

export default async () => {
  const wallet = await getWallet();

  if (wallet) {
    await setOrganizationServerSetting('address', wallet.signingKey.address);
    return true;
  }
  return false;
};
