import { getRegisteredOrganization } from '../services/organization';
import { getWallet } from '../utils/wallet';
import { logger } from 'radish34-logger';

export default async () => {
  const wallet = await getWallet();
  const orgInfo = await getRegisteredOrganization(wallet.signingKey.address);

  if (orgInfo.role) {
    logger.info(`Your organization has already been registered with the registry.`, { service: 'API' });
    return true;
  }
  logger.warning('You have not yet registered your organization with the registry.', { service: 'API' });
  return false;
};
