/**
 * HACK!!!!!!
 * 
 * This file is a flattened version of the crypto/ecc directory "borrowed"
 * from the api module... --KT
 * 
 * TODO: refactor shared utils into a `common` package
*/

// the various parameters needed to describe the Babyjubjub curve that we use zkp keys & signatures
const BABYJUBJUB = {
  JUBJUBA: BigInt(168700),
  JUBJUBD: BigInt(168696),
  INFINITY: [BigInt(0), BigInt(1)],
  GENERATOR: [
    BigInt('16540640123574156134436876038791482806971768689494387082833631921987005038935'),
    BigInt('20819045374670962167435360035096875258406992893633759881276124905556507972311'),
  ],
  JUBJUBE: BigInt(
    '21888242871839275222246405745257275088614511777268538073601725287587578984328',
  ),
  JUBJUBC: BigInt(8),
  MONTA: BigInt(168698),
  MONTB: BigInt(1),
};

const ZOKRATES_PRIME = BigInt(
'21888242871839275222246405745257275088548364400416034343698204186575808495617',
); // decimal representation of the prime p of GaloisField(p)

const { JUBJUBE, JUBJUBC, GENERATOR } = BABYJUBJUB;
const Fp = BigInt(ZOKRATES_PRIME); // the prime field used with the curve E(Fp)
const Fq = JUBJUBE / JUBJUBC;

const isOnCurve = p => {
  const { JUBJUBA: a, JUBJUBD: d } = BABYJUBJUB;
  const uu = (p[0] * p[0]) % Fp;
  const vv = (p[1] * p[1]) % Fp;
  const uuvv = (uu * vv) % Fp;
  return (a * uu + vv) % Fp === (one + d * uuvv) % Fp;
};

const edwardsCompress = p => {
  const px = p[0];
  const py = p[1];
  const xBits = px.toString(2).padStart(256, '0');
  const yBits = py.toString(2).padStart(256, '0');
  const sign = xBits[255] === '1' ? '1' : '0';
  const yBitsC = sign.concat(yBits.slice(1)); // add in the sign bit
  const y = ensure0x(
    BigInt('0b'.concat(yBitsC))
      .toString(16)
      .padStart(64, '0'),
  ); // put yBits into hex
  return y;
};

const edwardsDecompress = y => {
  const { JUBJUBA: a, JUBJUBD: d } = BABYJUBJUB;
  const py = BigInt(y)
    .toString(2)
    .padStart(256, '0');
  const sign = py[0];
  const yfield = BigInt(`0b${py.slice(1)}`); // remove the sign encoding
  if (yfield > ZOKRATES_PRIME || yfield < 0)
    throw new Error(`y cordinate ${yfield} is not a field element`);
  // 168700.x^2 + y^2 = 1 + 168696.x^2.y^2
  const y2 = mulMod([yfield, yfield]);
  const x2 = modDivide(addMod([y2, BigInt(-1)]), addMod([mulMod([d, y2]), -a]), ZOKRATES_PRIME);
  let xfield = squareRootModPrime(x2);
  const px = BigInt(xfield)
    .toString(2)
    .padStart(256, '0');
  if (px[255] !== sign) xfield = ZOKRATES_PRIME - xfield;
  const p = [xfield, yfield];
  if (!isOnCurve(p)) throw new Error('The computed point was not on the Babyjubjub curve');
  return p;
};

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

const {
  leftPadHex,
  strip0x,
  ensure0x,
  hexToBinaryArray,
  hexToBinary,
  hexToBytes,
  hexToDec,
  hexToFieldLimbs,
  hexToAscii,
  hexToUtf8,
  // binToHex,
  decToHex,
  rndHex,
  utf8ToHex,
  asciiToHex,
} = require('./conversions');

/**
TODO WARNING: THIS IS NOT FOOL PROOF. IT MIGHT INFER THE WRONG TYPE - e.g. if a hex number has no '0x' and no 'abcdef' values
*/
const inferType = value => {
  if (/^[0-9]+$/.test(value)) return 'integer';
  if (value.indexOf('0x') === 0 || /^[0-9a-fA-F]+$/.test(strip0x(value)) === true) return 'hex';
  if (/^[\x00-\x7F]*$/.test(value) === true) return 'ascii'; // eslint-disable-line no-control-regex
  return 'utf8';
};

/**
This class defines a 'convertible' element.  That's basically an object that can be converted into many common types: 'hex', 'integer', 'field', 'binary', 'bits', 'bytes', 'ascii', 'utf8'.
@param {string} value the input value
@param {string} type enum of: ['hex', 'binary', 'integer', 'ascii', 'utf8']
@param {integer} limbBitLength - optional - when converting to a field, specify the default limbBitLength of each limb. A different limb parameter can always be specified at the time of 'getting' this.field().
@param {integer} numberOfLimbs - optional - when converting to a field, specify the default numberOfLimbs. A different limb parameter can always be specified at the time of 'getting' this.field().
*/
class Element {
  constructor(value, type = inferType(value), limbBitLength = 128, numberOfLimbs = 2) {
    if (value === undefined) throw new Error('Input value was undefined');
    if (value === '') throw new Error('Input was empty');
    // regardless of the input type, we convert it to hex and store it as hex:
    switch (type) {
      default:
        // hex
        this._hex = ensure0x(value);
        break;
      case 'hex':
        this._hex = ensure0x(value);
        break;
      // DISALLOWING binary input, because it can be confused with decimal when inferring.
      // case 'binary':
      //   this._hex = binToHex(value);
      //   break;
      case 'integer':
        this._hex = decToHex(value.toString());
        break;
      case 'ascii':
        this._hex = asciiToHex(value);
        break;
      case 'utf8':
        this._hex = utf8ToHex(value);
        break;
    }

    this.limbBitLength = limbBitLength;
    this.numberOfLimbs = numberOfLimbs;
  }

  get binary() {
    return hexToBinary(this._hex);
  }

  get bits() {
    return hexToBinaryArray(this._hex);
  }

  get bytes() {
    return hexToBytes(this._hex);
  }

  get integer() {
    return hexToDec(this._hex);
  }

  get ascii() {
    return hexToAscii(this._hex);
  }

  get utf8() {
    return hexToUtf8(this._hex);
  }

  hex(octetLength) {
    if (octetLength) {
      return leftPadHex(this._hex, octetLength);
    }
    return this._hex;
  }

  field(limbBitLength = this.limbBitLength, numberOfLimbs = this.numberOfLimbs, suppressWarnings) {
    const outputField = hexToFieldLimbs(this._hex, limbBitLength, numberOfLimbs, suppressWarnings);
    return outputField;
  }
}

/**
A very broad stroke: converts all values of an object to the element class.
TODO: WARNING: Types are inferred within the Element class constructor. Types might be mistaken in rare cases.
*/
const elementifyObject = _object => {
  const object = {};
  // eslint-disable-next-line no-restricted-syntax
  for (const [key, value] of Object.entries(_object)) {
    if (Array.isArray(value)) {
      object[key] = value.map(item => new Element(item));
    } else if (typeof value === 'object') {
      object[key] = elementifyObject(value);
    } else if (typeof value === 'undefined') {
      object[key] = value;
    } else if (typeof value === 'boolean') {
      object[key] = value;
    } else {
      object[key] = new Element(value);
    }
  }
  return object;
};

const elementify = thing => {
  if (Array.isArray(thing)) {
    const array = thing.map(item => new Element(item));
    return array;
  }
  if (typeof thing === 'object') {
    const object = elementifyObject(thing);
    return object;
  }
  const element = new Element(thing);
  return element;
};

// modular division

const one = BigInt(1);
const zero = BigInt(0);

// function for extended Euclidean Algorithm
// (used to find modular inverse.
const gcdExtended = (a, b, _xy) => {
  const xy = _xy;
  if (a === zero) {
    xy[0] = zero;
    xy[1] = one;
    return b;
  }
  const xy1 = [zero, zero];
  const gcd = gcdExtended(b % a, a, xy1);

  // Update x and y using results of recursive call
  xy[0] = xy1[1] - (b / a) * xy1[0];
  xy[1] = xy1[0]; // eslint-disable-line prefer-destructuring

  return gcd;
};

// Function to find modulo inverse of b.
const modInverse = (b, m) => {
  const xy = [zero, zero]; // used in extended GCD algorithm
  const g = gcdExtended(b, m, xy);
  if (g !== one) throw new Error('Numbers were not relatively prime');
  // m is added to handle negative x
  return ((xy[0] % m) + m) % m;
};

// Function to compute a/b mod m
const modDivide = (a, b, m) => {
  const aa = ((a % m) + m) % m; // check the numbers are mod m and not negative
  const bb = ((b % m) + m) % m; // do we really need this?
  const inv = modInverse(bb, m);
  return (inv * aa) % m;
};

/* eslint no-bitwise: ["error", { "allow": ["^"] }] */
// This module mostly takes some useful functions from:
// https://github.com/rsandor/number-theory
// but converts them for BigInt (the original library is limited to <2**52)
// We are very grateful for the original work by rsandor

const addMod = (addMe, m = ZOKRATES_PRIME) => {
  return addMe.reduce((e, acc) => (((e + m) % m) + acc) % m, BigInt(0));
};

// const mulMod = (timesMe, m = ZOKRATES_PRIME) => {
//   return timesMe.reduce((e, acc) => (((e + m) % m) * acc) % m, BigInt(1));
// };

const mulMod = (timesMe, m = ZOKRATES_PRIME) => {
  return timesMe.reduce((e, acc) => (((e + m) % m) * acc) % m);
};

const powerMod = (base, exponent, m = ZOKRATES_PRIME) => {
  if (m === BigInt(1)) return BigInt(0);
  let result = BigInt(1);
  let b = (base + m) % m; // add m in case it's negative: % gives the remainder, not the mod
  let e = exponent;
  while (e > BigInt(0)) {
    if (e % BigInt(2) === BigInt(1)) result = (result * b) % m;
    e >>= BigInt(1); // eslint-disable-line no-bitwise
    b = (b * b) % m;
  }
  return result;
};

const jacobiSymbol = (_a, _b) => {
  if (typeof _a !== 'bigint') throw new Error(`first parameter ${_a} is not a Bigint`);
  if (typeof _b !== 'bigint') throw new Error(`second parameter ${_b} is not a Bigint`);
  let a = _a;
  let b = _b;
  if (b % BigInt(2) === BigInt(0)) return NaN;
  if (b < BigInt(0)) return NaN;

  // (a on b) is independent of equivalence class of a mod b
  if (a < BigInt(0)) a = (a % b) + b;

  // flips just tracks parity, so I xor terms with it and end up looking at the
  // low order bit
  let flips = 0;
  // TODO Refactor while loop
  // eslint-disable-next-line no-constant-condition
  while (true) {
    a %= b;
    // (0 on b) = 0
    if (a === BigInt(0)) return 0;
    // Calculation of (2 on b)
    while (a % BigInt(2) === BigInt(0)) {
      // b could be so large that b*b overflows
      flips ^= Number(((b % BigInt(8)) * (b % BigInt(8)) - BigInt(1)) / BigInt(8)); // eslint-disable-line no-bitwise
      a /= BigInt(2);
    }

    // (1 on b) = 1
    if (a === BigInt(1)) {
      // look at the low order bit of flips to extract parity of total flips
      return flips & 1 ? -1 : 1; // eslint-disable-line no-bitwise
    }

    // Now a and b are coprime and odd, so "QR" applies
    // By reducing modulo 4, I avoid the possibility that (a-1)*(b-1) overflows
    flips ^= Number((((a % BigInt(4)) - BigInt(1)) * ((b % BigInt(4)) - BigInt(1))) / BigInt(4)); // eslint-disable-line no-bitwise

    const temp = a;
    a = b;
    b = temp;
  }
};

const quadraticNonresidue = p => {
  const SAFELOOP = BigInt(100000);
  const q = SAFELOOP < p ? SAFELOOP : p;
  for (let x = BigInt(2); x < q; x += BigInt(1)) {
    if (jacobiSymbol(x, p) === -1) return x;
  }
  return NaN;
};

const squareRootModPrime = (n, p = ZOKRATES_PRIME) => {
  if (jacobiSymbol(n, p) !== 1) return NaN;

  let Q = p - BigInt(1);
  let S = BigInt(0);
  while (Q % BigInt(2) === BigInt(0)) {
    Q /= BigInt(2);
    S += BigInt(1);
  }

  // Now p - 1 = Q 2^S and Q is odd.
  if (p % BigInt(4) === BigInt(3)) {
    return powerMod(n, (p + BigInt(1)) / BigInt(4), p);
  }
  // So S != 1 (since in that case, p equiv 3 mod 4
  const z = quadraticNonresidue(p);
  let c = powerMod(z, Q, p);
  let R = powerMod(n, (Q + BigInt(1)) / BigInt(2), p);
  let t = powerMod(n, Q, p);
  let M = S;
  // TODO Refactor while loop
  // eslint-disable-next-line no-constant-condition
  while (true) {
    if (t % p === BigInt(1)) return R;

    // Find the smallest i (0 < i < M) such that t^{2^i} = 1
    let u = t;
    let i;
    for (i = BigInt(1); i < M; i += BigInt(1)) {
      u = (u * u) % p;
      if (u === BigInt(1)) break;
    }

    const minimumI = i;
    i += BigInt(1);

    // Set b = c^{2^{M-i-1}}
    let b = c;
    while (i < M) {
      b = (b * b) % p;
      i += BigInt(1);
    }

    M = minimumI;
    R = (R * b) % p;
    t = (t * b * b) % p;
    c = (b * b) % p;
  }
};

module.exports = { generateKeyPair };
