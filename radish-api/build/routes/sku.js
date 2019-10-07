"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _sku = _interopRequireDefault(require("../__fixtures__/sku"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = _express.default.Router();

router.get('/', async (req, res, next) => {
  try {
    const sku = await (0, _sku.default)(10);
    return res.append('Total-Count', sku.length).json(sku);
  } catch (err) {
    return next(err);
  }
});
var _default = router;
exports.default = _default;