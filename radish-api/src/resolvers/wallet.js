import { getAddress, getBalance, getPublicKey, sign, verify } from '../services/wallet';

export default {
  Query: {
    myWalletAddress() {
      return getAddress();
    },
    myWalletBalance() {
      return getBalance();
    },
    // DO NOT USE - DEPRECATED - MOVED TO ./radish-api/src/resolvers/crypto.js
    myPublicKey() {
      return getPublicKey();
    },
    // DO NOT USE - DEPRECATED - MOVED TO ./radish-api/src/resolvers/crypto.js
    signature(_parent, args) {
      return sign(args.hashInHex);
    },
    // DO NOT USE - DEPRECATED - MOVED TO ./radish-api/src/resolvers/crypto.js
    signatureVerification(_parent, args) {
      return verify(args.publicKey, args.hashInHex, args.signature);
    },
  },
};
