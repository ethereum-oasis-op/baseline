"use strict";

var _db = _interopRequireDefault(require("./db"));

var _app = require("./app");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const main = async () => {
  try {
    await _db.default.connect();
    (0, _app.startServer)();
  } catch (err) {
    console.log(err);
  }
};

main();