'use strict';

var defaults = require("./default.js");
var config = require("./" + (process.env.NODE_ENV || "development") + ".js");

// Copy 'defaults' and 'config' objects into empty object, then export
module.exports = Object.assign({}, JSON.parse(JSON.stringify(defaults)), JSON.parse(JSON.stringify(config)));
