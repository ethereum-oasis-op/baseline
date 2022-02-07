/**
functions to support signatures over a BabyJubJub curve
*/
const { BABYJUBJUB, ZOKRATES_PRIME } = require('./babyjubjub-params');
const { modDivide } = require('./modular-division'); // TODO REPLACE WITH NPM VERSION
const { edwardsCompress } = require('./compress-decompress');
const { rndHex, hexToDec } = require('../conversions');

const one = BigInt(1);
const { JUBJUBE, JUBJUBC, GENERATOR } = BABYJUBJUB;
const Fp = BigInt(ZOKRATES_PRIME); // the prime field used with the curve E(Fp)
const Fq = JUBJUBE / JUBJUBC;

function isOnCurve(p) {
  const { JUBJUBA: a, JUBJUBD: d } = BABYJUBJUB;
  const uu = (p[0] * p[0]) % Fp;
  const vv = (p[1] * p[1]) % Fp;
  const uuvv = (uu * vv) % Fp;
  return (a * uu + vv) % Fp === (one + d * uuvv) % Fp;
}

function negate(g) {
  return [Fp - g[0], g[1]]; // this is wierd - we negate the x coordinate, not the y with babyjubjub!
}

/**
Point addition on the babyjubjub curve TODO - MOD P THIS
*/
function add(p, q) {
  const { JUBJUBA: a, JUBJUBD: d } = BABYJUBJUB;
  const u1 = p[0];
  const v1 = p[1];
  const u2 = q[0];
  const v2 = q[1];
  const uOut = modDivide(u1 * v2 + v1 * u2, one + d * u1 * u2 * v1 * v2, Fp);
  const vOut = modDivide(v1 * v2 - a * u1 * u2, one - d * u1 * u2 * v1 * v2, Fp);
  if (!isOnCurve([uOut, vOut])) throw new Error('Addition point is not on the babyjubjub curve');
  return [uOut, vOut];
}

/**
Scalar multiplication on a babyjubjub curve
@param {String} scalar - scalar mod q (will wrap if greater than mod q, which is probably ok)
@param {Object} h - curve point in u,v coordinates
*/
function scalarMult(scalar, h) {
  const { INFINITY } = BABYJUBJUB;
  const a = ((BigInt(scalar) % Fq) + Fq) % Fq; // just in case we get a value that's too big or negative
  const exponent = a.toString(2).split(''); // extract individual binary elements
  let doubledP = [...h]; // shallow copy h to prevent h being mutated by the algorithm
  let accumulatedP = INFINITY;
  for (let i = exponent.length - 1; i >= 0; i--) {
    const candidateP = add(accumulatedP, doubledP);
    accumulatedP = exponent[i] === '1' ? candidateP : accumulatedP;
    doubledP = add(doubledP, doubledP);
  }
  if (!isOnCurve(accumulatedP))
    throw new Error('Scalar multiplication point is not on the babyjubjub curve');
  return accumulatedP;
}

/**
function to generate a zkp key pair
@param {string} privateKey - OPTIONAL hex string
*/
function generateKeyPair(privateKey = rndHex(32)) {
  const publicKey = scalarMult(hexToDec(privateKey), GENERATOR);
  const publicKeyCompressed = edwardsCompress(publicKey);

  return {
    privateKey,
    publicKey,
    publicKeyCompressed, // <--- this is what we refer to as 'zkpPublicKey'
  };
}

/**
function to generate a zkp key pair
@param {string} privateKey - hex string
@param {Array} publicKey - a point
*/
function checkKeyPair(_privateKey, _publicKey) {
  const publicKey = scalarMult(hexToDec(_privateKey), GENERATOR);
  const publicKeyCompressed = edwardsCompress(publicKey);
  if (publicKeyCompressed === _publicKey) {
    return true;
  }
  throw new Error(
    `ZKP key pair does not reconcile: expected publicKeyCompressed ${publicKeyCompressed} to equal input publicKey ${_publicKey}`,
  );
}

module.exports = {
  isOnCurve,
  negate,
  add,
  scalarMult,
  generateKeyPair,
  checkKeyPair,
};
