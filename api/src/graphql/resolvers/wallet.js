import { getAddress, getBalance } from '../../services/wallet';

export default {
  Query: {
    myWalletAddress() {
      return getAddress();
    },
    myWalletBalance() {
      return getBalance();
    },
  },
};
