export const promisedTimeout = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};
