"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _faker = require("faker");

var _helpers = require("./helpers");

var _uom = require("./uom");

const generateSKU = overrides => {
  const dimension = (0, _uom.getDimension)();
  const weight = (0, _uom.getWeight)();
  const volume = (0, _uom.getArea)();
  return {
    sku: (0, _helpers.getRandomInt)(10000000, 90000000),
    name: _faker.commerce.productName(),
    dimensions: {
      uom: dimension,
      length: (0, _helpers.getRandomInt)(1, 10),
      width: (0, _helpers.getRandomInt)(1, 10),
      height: (0, _helpers.getRandomInt)(1, 10)
    },
    weight: {
      uom: weight,
      amount: (0, _helpers.getRandomInt)(1, 10)
    },
    volume: {
      uom: volume,
      amount: (0, _helpers.getRandomInt)(1, 10)
    },
    packaging: {
      quantity: 10,
      dimensions: {
        uom: dimension,
        length: (0, _helpers.getRandomInt)(1, 10),
        width: (0, _helpers.getRandomInt)(1, 10),
        height: (0, _helpers.getRandomInt)(1, 10)
      }
    },
    ...overrides
  };
};

var _default = (n = 1, overrides = {}) => (0, _helpers.generate)(() => generateSKU(overrides), n);

exports.default = _default;