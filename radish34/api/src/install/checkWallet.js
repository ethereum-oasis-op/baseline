import { setOrganizationWalletAddress } from '../utils/serverSettings';
import { getWallet } from '../utils/wallet';

export default async () => {
  const wallet = await getWallet();
  if (wallet) {
    const { address } = wallet.signingKey;
    console.log(`Loading wallet with address ${address}`);
    setOrganizationWalletAddress(address);
    return true;
  }
  return false;
};
