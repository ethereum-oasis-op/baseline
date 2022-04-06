import { strip0x } from '../../conversions';
import { logger } from 'radish34-logger';

/* eslint-disable no-bitwise */
/* eslint-disable no-plusplus */

const createKeccakHash = require('keccak');

const ZOKRATES_PRIME =
  '21888242871839275222246405745257275088548364400416034343698204186575808495617';

function keccak256Hash(item) {
  const preimage = strip0x(item);
  const h = `0x${createKeccakHash('keccak256')
    .update(preimage, 'hex')
    .digest('hex')}`;
  return h;
}

function addMod(addMe, m) {
  return addMe.reduce((e, acc) => (e + acc) % m, BigInt(0));
}

function powerMod(base, exponent, m) {
  if (m === BigInt(1)) return BigInt(0);
  let result = BigInt(1);
  let b = base % m;
  let e = exponent;
  while (e > BigInt(0)) {
    if (e % BigInt(2) === BigInt(1)) result = (result * b) % m;
    e >>= BigInt(1);
    b = (b * b) % m;
  }
  return result;
}

/**
mimc encryption function
@param {String} x - the input value
@param {String} k - the key value
@param {String} seed - input seed for first round (=0n for a hash)
@param
*/
function mimcpe7(x, k, seed, roundCount, m) {
  let xx = x;
  let t;
  let c = seed;
  for (let i = 0; i < roundCount; i++) {
    c = keccak256Hash(c);
    t = addMod([xx, BigInt(c), k], m); // t = x + c_i + k
    xx = powerMod(t, BigInt(7), m); // t^7
  }
  // Result adds key again as blinding factor
  return addMod([xx, k], m);
}

function mimcpe7mp(x, k, seed, roundCount, m = BigInt(ZOKRATES_PRIME)) {
  let r = k;
  let i;
  for (i = 0; i < x.length; i++) {
    r = (r + (x[i] % m) + mimcpe7(x[i], r, seed, roundCount, m)) % m;
  }
  return r;
}

/**
 @param {Array} preimage - an array of hex strings or integer values, which will be concatenated and hashed. Each value must be less than the field size (ZOKRATE_PRIME)
*/
export const mimcHash = (...preimage) => {
  const mimc = '0x6d696d63'; // this is 'mimc' in hex as a nothing-up-my-sleeve seed
  const hash = `0x${mimcpe7mp(
    preimage.map(e => {
      const f = BigInt(e);
      if (f > ZOKRATES_PRIME) throw new Error('MiMC input exceeded prime field size');
      return f;
    }),
    BigInt(0),
    keccak256Hash(mimc),
    91,
  )
    .toString(16)
    .padStart(64, '0')}`;

  logger.debug(`mimcHash: ${hash}.`, { service: 'API' });
  return hash;
};

/**
 @param {Array} leaves - an array of hex strings or integer values
*/
export const merkleHash = leaves => {
  logger.debug('Input leaves: %o', leaves, { service: 'API' });
  const leafCount = leaves.length;
  // if (leafCount !== 2 ** treeHeight) throw new Error("Incorrect number of leaves for tree height!");
  let inputs = [];
  if (leafCount === 2) {
    inputs = leaves;
    const hash = mimcHash(...inputs);
    logger.debug(`Bottom level: mimicHash ${hash} for inputs %o`, inputs, { service: 'API' });
    return hash;
  }
  inputs[0] = merkleHash(leaves.slice(0, leafCount / 2));
  inputs[1] = merkleHash(leaves.slice(leafCount / 2, leafCount));
  const hash = mimcHash(...inputs);
  logger.debug(`Upper levels: leafCount ${leafCount} and mimicHash ${hash} for inputs %o`, inputs, { service: 'API' });
  return hash;
};

export default { mimcHash, merkleHash };
