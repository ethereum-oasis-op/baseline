"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _rfq = _interopRequireDefault(require("../__fixtures__/rfq"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = _express.default.Router();

router.get('/', async (req, res, next) => {
  try {
    const rfq = await (0, _rfq.default)(10);
    return res.append('Total-Count', rfq.length).json(rfq);
  } catch (err) {
    return next(err);
  }
});
var _default = router;
exports.default = _default;