import { getAddress, getBalance, getPublicKey, sign, verify } from '../../services/wallet';

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
