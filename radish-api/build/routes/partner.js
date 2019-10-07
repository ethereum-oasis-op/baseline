"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _partner = _interopRequireDefault(require("../__fixtures__/partner"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = _express.default.Router();

router.get('/', async (req, res, next) => {
  try {
    const partner = await (0, _partner.default)(10);
    return res.append('Total-Count', partner.length).json(partner);
  } catch (err) {
    return next(err);
  }
});
var _default = router;
exports.default = _default;