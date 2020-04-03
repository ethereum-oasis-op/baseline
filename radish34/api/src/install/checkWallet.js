import { setOrganizationWalletAddress } from '../utils/serverSettings';
import { getWallet } from '../utils/wallet';

export default async () => {
  const wallet = await getWallet();
  if (wallet) {
    console.log(`Loading wallet with address ${wallet.signingKey.address}`);
    setOrganizationWalletAddress(wallet.signingKey.address);
    return true;
  }
  return false;
};
