/**
Price is calculated based on msa.accumulatedVolumeOrdered, whereas for calculating the amount owed at the time of a delivery, we will use msa.accumulatedVolumeDelivered.
*/
export const calculatePrice = (tierBounds, pricesByTier, oldAccumulatedVolume, volume) => {
  // const { tierBounds, pricesByTier } = msa.constants;
  // latestCommitment = msa.commitments.slice(-1)[0];
  // const { accumulatedVolumeOrdered } = latestCommitment.variables;
  //
  // const { volume } = po.constants;
  //
  // const oldVolume = accumulatedVolumeOrdered;
  // const newVolume = oldVolume + volume;

  const oldVolume = oldAccumulatedVolume;
  const newVolume = oldVolume + volume;

  // TODO: decide if the js arrays for tierBounds and pricesByTier will be padded to the size of the preimage of the hashOfTieredPricing or not.
  const numberOfTiers = tierBounds.length - 1;
  const lowerBoundForTier = new Array(numberOfTiers).fill(0);
  const upperBoundForTier = new Array(numberOfTiers).fill(0);

  /**
  Permutations:
  tierBounds denoted by |
  oldVolume & newVolume denoted by X
  lower & upper bounds denoted by ^

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

  let totalPrice = 0;
  for (let i = 0; i < numberOfTiers; i++) {
    // Create the upper and lower bounds for each tier:
    lowerBoundForTier[i] = Math.min(Math.max(tierBounds[i], oldVolume), tierBounds[i + 1]);
    upperBoundForTier[i] = Math.max(Math.min(tierBounds[i + 1], newVolume), tierBounds[i]);

    // increment the totalPrice by the total price of each tier:
    totalPrice += pricesByTier[i] * (upperBoundForTier[i] - lowerBoundForTier[i]);
  }

  return totalPrice;
};

export default {
  calculatePrice,
};
