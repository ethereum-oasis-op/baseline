'use strict';

var defaults = require("./default.js");
var config = require("./" + (process.env.NODE_ENV || "development") + ".js");
module.exports = Object.assign({}, JSON.parse(JSON.stringify(defaults)), JSON.parse(JSON.stringify(config)));