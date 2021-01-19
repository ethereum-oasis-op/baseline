import { getBalance } from '../utils/wallet';
import { logger } from 'radish34-logger';

const minBalance = 50;

export default async () => {
  const balance = await getBalance();
  if (balance > minBalance) {
    logger.info(`Wallet balance: ${balance}.`, { service: 'API' });
    return true;
  }
  logger.warning(`Not enough Eth in account! You need ${minBalance} but only have ${balance} available.`, { service: 'API' });
  return false;
};
