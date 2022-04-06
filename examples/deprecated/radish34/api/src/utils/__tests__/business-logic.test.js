import { calculatePrice } from '../business-logic';

/**
Permutations:
tierBounds denoted by |
oldVolume & newVolume denoted by X
lower & upper bounds denoted by ^
      2   3   5  7   9  11  13  17
a)  X   X   |             |
            ^
b)      X   |______X      |
            ^      ^
c)          |   X_____X   |
                ^     ^
d)      X   |_____________|   X
            ^             ^
e)          |      X______|   X
                   ^      ^
f)          |             |   X   X
                          ^
*/
// Consts for price calculation permutations:
// Values chosen for uniqueness:
const permutations = [
  { tierBounds: [5, 37], oldVolume: 0, newVolume: 2 }, // 0
  { tierBounds: [5, 37], oldVolume: 2, newVolume: 17 }, // 12
  { tierBounds: [5, 37], oldVolume: 10, newVolume: 26 }, // 16
  { tierBounds: [5, 37], oldVolume: 2, newVolume: 50 }, // 32
  { tierBounds: [5, 37], oldVolume: 17, newVolume: 50 }, // 20
  { tierBounds: [5, 37], oldVolume: 50, newVolume: 67 }, // 0
];
const singleTierPrice = 1; // arbitrary choice
const priceChecks = [0, 12, 16, 32, 20, 0];

/**
Mimics the logic in the circuit, to check its correctness relative to the js implementation.
*/
const calculatePriceLikeCircuit = (tierBounds, pricesByTier, oldAccumulatedVolume, volume) => {
  const oldVolume = oldAccumulatedVolume;
  const newVolume = oldVolume + volume;

  // TODO: decide if the js arrays for tierBounds and pricesByTier will be padded to the size of the preimage of the hashOfTieredPricing or not.
  const numberOfTiers = tierBounds.length - 1;
  const lowerBoundForTier = new Array(numberOfTiers).fill(0);
  const upperBoundForTier = new Array(numberOfTiers).fill(0);

  let totalPrice = 0;
  for (let i = 0; i < numberOfTiers; i++) {
    // Create the upper and lower bounds for each tier:
    lowerBoundForTier[i] = oldVolume >= tierBounds[i] ? oldVolume : tierBounds[i];
    lowerBoundForTier[i] =
      oldVolume <= tierBounds[i + 1] ? lowerBoundForTier[i] : tierBounds[i + 1];

    upperBoundForTier[i] = newVolume <= tierBounds[i + 1] ? newVolume : tierBounds[i + 1];
    upperBoundForTier[i] = newVolume >= tierBounds[i] ? upperBoundForTier[i] : tierBounds[i];

    // increment the totalPrice by the total price of each tier:
    totalPrice += pricesByTier[i] * (upperBoundForTier[i] - lowerBoundForTier[i]);
  }

  return totalPrice;
};

describe('business-logic.js tests', () => {
  describe('calculatePrice', () => {
    for (let i = 0; i < permutations.length; i++) {
      const { tierBounds, oldVolume, newVolume } = permutations[i];
      const volume = newVolume - oldVolume;
      // eslint-disable-next-line no-loop-func
      test(`permutations[${i}]:`, () => {
        expect(calculatePrice(tierBounds, [singleTierPrice], oldVolume, volume)).toEqual(
          priceChecks[i],
        );
      });
    }
  });
  describe('calculatePriceLikeCircuit', () => {
    for (let i = 0; i < permutations.length; i++) {
      const { tierBounds, oldVolume, newVolume } = permutations[i];
      const volume = newVolume - oldVolume;
      // eslint-disable-next-line no-loop-func
      test(`permutations[${i}]:`, () => {
        expect(calculatePriceLikeCircuit(tierBounds, [singleTierPrice], oldVolume, volume)).toEqual(
          priceChecks[i],
        );
      });
    }
  });
});
