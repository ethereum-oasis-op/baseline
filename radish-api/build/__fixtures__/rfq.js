"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _faker = require("faker");

var _helpers = require("./helpers");

var _sku = _interopRequireDefault(require("./sku"));

var _partner = _interopRequireDefault(require("./partner"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const generateRFQ = overrides => ({
  sentBy: _faker.company.companyName(),
  sentDate: _faker.date.recent(),
  neededBy: _faker.date.recent(),
  supplier: (0, _partner.default)(),
  skus: (0, _sku.default)((0, _helpers.getRandomInt)(1, 5)),
  ...overrides
});

var _default = (n = 1, overrides = {}) => (0, _helpers.generate)(() => generateRFQ(overrides), n);

exports.default = _default;