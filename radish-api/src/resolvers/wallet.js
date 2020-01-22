import { getAddress, getBalance, getPublicKey, sign, verify } from '../services/wallet';

export default {
  Query: {
    myWalletAddress() {
      return getAddress();
    },
    myWalletBalance() {
      return getBalance();
    },
    myPublicKey() {
      return getPublicKey();
    },
    signature(_parent, args) {
      return sign(args.hashInHex);
    },
    signatureVerification(_parent, args) {
      return verify(args.publicKey, args.hashInHex, args.signature);
    },
  },
};
