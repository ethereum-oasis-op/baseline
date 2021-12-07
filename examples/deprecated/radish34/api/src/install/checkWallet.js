import { setOrganizationWalletAddress } from '../utils/serverSettings';
import { getWallet } from '../utils/wallet';
import { logger } from 'radish34-logger';

export default async () => {
  const wallet = await getWallet();

  if (wallet) {
    logger.info(`Loading wallet with address ${wallet.signingKey.address}.`, { service: 'API' });
    setOrganizationWalletAddress(wallet.signingKey.address);
    return true;
  }
  return false;
};
