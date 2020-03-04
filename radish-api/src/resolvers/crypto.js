import { getPublicKey, sign, verify } from '../utils/crypto/ecc/eddsa';

export default {
  Query: {
    // DO NOT USE - DEPRECATED - MOVED TO ./radish-api/src/resolvers/crypto.js
    myPublicKey() {
      return getPublicKey();
    },
    // DO NOT USE - DEPRECATED - MOVED TO ./radish-api/src/resolvers/crypto.js
    sign(_parent, args) {
      return sign(args.hashInHex);
    },
    // DO NOT USE - DEPRECATED - MOVED TO ./radish-api/src/resolvers/crypto.js
    verifySignature(_parent, args) {
      return verify(args.publicKey, args.hashInHex, args.signature);
    },
  },
};
