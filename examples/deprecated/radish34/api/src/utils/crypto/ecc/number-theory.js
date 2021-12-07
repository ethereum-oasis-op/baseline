/* eslint no-bitwise: ["error", { "allow": ["^"] }] */
// This module mostly takes some useful functions from:
// https://github.com/rsandor/number-theory
// but converts them for BigInt (the original library is limited to <2**52)
// We are very grateful for the original work by rsandor

import { ZOKRATES_PRIME } from './babyjubjub-params';

export const addMod = (addMe, m = ZOKRATES_PRIME) => {
  return addMe.reduce((e, acc) => (((e + m) % m) + acc) % m, BigInt(0));
};

// export const mulMod = (timesMe, m = ZOKRATES_PRIME) => {
//   return timesMe.reduce((e, acc) => (((e + m) % m) * acc) % m, BigInt(1));
// };

export const mulMod = (timesMe, m = ZOKRATES_PRIME) => {
  return timesMe.reduce((e, acc) => (((e + m) % m) * acc) % m);
};

export const powerMod = (base, exponent, m = ZOKRATES_PRIME) => {
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

export const jacobiSymbol = (_a, _b) => {
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

export const quadraticNonresidue = p => {
  const SAFELOOP = BigInt(100000);
  const q = SAFELOOP < p ? SAFELOOP : p;
  for (let x = BigInt(2); x < q; x += BigInt(1)) {
    if (jacobiSymbol(x, p) === -1) return x;
  }
  return NaN;
};

export const squareRootModPrime = (n, p = ZOKRATES_PRIME) => {
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
