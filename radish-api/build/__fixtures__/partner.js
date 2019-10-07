"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _faker = require("faker");

var _helpers = require("./helpers");

const generatePartner = overrides => ({
  name: _faker.company.companyName(),
  address: _faker.finance.ethereumAddress(),
  ...overrides
});

var _default = (n = 1, overrides = {}) => (0, _helpers.generate)(() => generatePartner(overrides), n);

exports.default = _default;