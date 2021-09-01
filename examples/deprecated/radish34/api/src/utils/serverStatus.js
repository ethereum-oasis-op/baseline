import { getBalance } from './wallet';

export const getServerStatus = async () => {
  const balance = await getBalance();
  return { balance };
};

export default {
  getServerStatus,
};
