/**
 * Format a number to currency
 * @param {number} number
 * @param {string} currency - The currency code according to ISO 4217
 */
export const formatCurrency = (number, currency = 'USD') =>
  number &&
  new Intl.NumberFormat(navigator.language, { style: 'currency', currency }).format(number);

/**
 * Calculates the price of a volume based on MSA tiering structure
 * @param {array} tierBounds - the tierBounds field for an MSA
 * @param {array} pricesByTier - the pricesByTier field for an MSA
 * @param {number} oldAccumulatedVolume - the accumulatedVolumeOrdered field for latest commitment in an MSA
 * @param {number} volume - the volume to calculate the price for
 */
export const calculateTieringPrice = (tierBounds, pricesByTier, oldAccumulatedVolume, volume) => {
  const oldVolume = oldAccumulatedVolume;
  const newVolume = oldVolume + volume;

  const numberOfTiers = tierBounds.length - 1;
  const lowerBoundForTier = new Array(numberOfTiers).fill(0);
  const upperBoundForTier = new Array(numberOfTiers).fill(0);

  let totalPrice = 0;
  for (let i = 0; i < numberOfTiers; i++) {
    lowerBoundForTier[i] = Math.min(Math.max(tierBounds[i], oldVolume), tierBounds[i + 1]);
    upperBoundForTier[i] = Math.max(Math.min(tierBounds[i + 1], newVolume), tierBounds[i]);

    totalPrice += pricesByTier[i] * (upperBoundForTier[i] - lowerBoundForTier[i]);
  }

  return totalPrice;
};
