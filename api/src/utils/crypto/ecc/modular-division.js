// modular division

const one = BigInt(1);
const zero = BigInt(0);

// function for extended Euclidean Algorithm
// (used to find modular inverse.
export const gcdExtended = (a, b, _xy) => {
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
export const modInverse = (b, m) => {
  const xy = [zero, zero]; // used in extended GCD algorithm
  const g = gcdExtended(b, m, xy);
  if (g !== one) throw new Error('Numbers were not relatively prime');
  // m is added to handle negative x
  return ((xy[0] % m) + m) % m;
};

// Function to compute a/b mod m
export const modDivide = (a, b, m) => {
  const aa = ((a % m) + m) % m; // check the numbers are mod m and not negative
  const bb = ((b % m) + m) % m; // do we really need this?
  const inv = modInverse(bb, m);
  return (inv * aa) % m;
};
