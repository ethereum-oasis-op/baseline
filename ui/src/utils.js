/**
 * Format a number to currency
 * @param {number} number
 * @param {string} currency - The currency code according to ISO 4217
 */
export const formatCurrency = (number, currency = 'USD') =>
  number &&
  new Intl.NumberFormat(navigator.language, { style: 'currency', currency }).format(number);
