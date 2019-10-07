import { commerce, image } from 'faker';
import { generate, getRandomInt } from './helpers';
import { getDimension, getWeight, getArea } from './uom';

const generateSKU = overrides => {
  const dimension = getDimension();
  const weight = getWeight();
  const volume = getArea();

  return ({
    sku: getRandomInt(10000000, 90000000),
    name: commerce.productName(),
    dimensions: {
      uom: dimension,
      length: getRandomInt(1,10),
      width: getRandomInt(1,10),
      height: getRandomInt(1,10),
    },
    weight: {
      uom: weight,
      amount: getRandomInt(1,10),
    },
    volume: {
      uom: volume,
      amount: getRandomInt(1,10),
    },
    packaging: {
      quantity: 10,
      dimensions: {
        uom: dimension,
        length: getRandomInt(1,10),
        width: getRandomInt(1,10),
        height: getRandomInt(1,10),
      },
    },
    ...overrides,
  })
}

export default (n = 1, overrides = {}) => generate(() => generateSKU(overrides), n);
