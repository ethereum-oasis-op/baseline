class TryError extends Error {
  promiseErrors: any[] = []
}

export const promisedTimeout = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const tryTimes = async <T>(prom: () => Promise<T>, times: number = 10000, wait: number = 500): Promise<T> => {
  const errors : any[] = [];
  for (let index = 0; index < times; index++) {
    try {
      return await prom()
    } catch (err) {
      errors.push(err);
    }
    await sleep(wait);
  }
  const error = new TryError("Unfulfilled promises");
  error.promiseErrors = errors;
  throw error;
}
