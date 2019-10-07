"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.getArea = exports.getWeight = exports.getDimension = exports.getAmount = exports.amounts = exports.fluids = exports.lengths = exports.areas = exports.weights = void 0;

var _helpers = require("./helpers");

const generateUOM = overrides => {
  const uom = uoms[(0, _helpers.getRandomInt)(0, uoms.length - 1)];
  return {
    name: uom.name,
    symbol: uom.symbol,
    ...overrides
  };
};

const weights = [{
  "name": "gram",
  "symbol": "g"
}, {
  "name": "kilogram",
  "symbol": "kg"
}, {
  "name": "grain",
  "symbol": "gr"
}, {
  "name": "denier",
  "symbol": "den"
}, {
  "name": "tex",
  "symbol": "tex"
}, {
  "name": "decitex",
  "symbol": "dtex"
}, {
  "name": "dram",
  "symbol": "dr"
}, {
  "name": "ounce",
  "symbol": "oz"
}, {
  "name": "pound",
  "symbol": "lb"
}, {
  "name": "hundredweight",
  "symbol": "cwt"
}, {
  "name": "tom",
  "symbol": "ton"
}, {
  "name": "pennyweight",
  "symbol": "dwt"
}, {
  "name": "troy ounce",
  "symbol": "oz t"
}, {
  "name": "troy pound",
  "symbol": "lb t"
}, {
  "name": "mommes",
  "symbol": "mm"
}];
exports.weights = weights;
const areas = [{
  "name": "millimeter",
  "symbol": "mm"
}, {
  "name": "centimeter",
  "symbol": "cm"
}, {
  "name": "decimeter",
  "symbol": "dm"
}, {
  "name": "kilometer",
  "symbol": "km"
}, {
  "name": "square foot",
  "symbol": "sqft"
}, {
  "name": "square meter",
  "symbol": "sqm"
}, {
  "name": "square chain",
  "symbol": "sqch"
}, {
  "name": "cubic inch",
  "symbol": "cu in"
}, {
  "name": "cubic foot",
  "symbol": "cu ft"
}, {
  "name": "cubic yard",
  "symbol": "cu yd"
}, {
  "name": "acre-foot",
  "symbol": "acre ft"
}];
exports.areas = areas;
const lengths = [{
  "name": "point",
  "symbol": "p"
}, {
  "name": "pica",
  "symbol": "P̸"
}, {
  "name": "inch",
  "symbol": "\""
}, {
  "name": "foot",
  "symbol": "'"
}, {
  "name": "yard",
  "symbol": "yd"
}, {
  "name": "mile",
  "symbol": "mi"
}, {
  "name": "link",
  "symbol": "li"
}, {
  "name": "rod",
  "symbol": "rd"
}, {
  "name": "chain",
  "symbol": "ch"
}, {
  "name": "cable",
  "symbol": "ftm"
}, {
  "name": "millimeter",
  "symbol": "mm"
}, {
  "name": "centimeter",
  "symbol": "cm"
}, {
  "name": "decimeter",
  "symbol": "dm"
}, {
  "name": "kilometer",
  "symbol": "km"
}];
exports.lengths = lengths;
const fluids = [{
  "name": "pint",
  "symbol": "pt"
}, {
  "name": "quart",
  "symbol": "qt"
}, {
  "name": "gallon",
  "symbol": "gal"
}, {
  "name": "minim",
  "symbol": "min"
}, {
  "name": "US fluid dram",
  "symbol": "fl dr"
}, {
  "name": "teaspoon",
  "symbol": "tsp"
}, {
  "name": "tablespoon",
  "symbol": "Tbsp"
}, {
  "name": "fluid ounce",
  "symbol": "fl oz"
}, {
  "name": "cup",
  "symbol": "cp"
}, {
  "name": "liter",
  "symbol": "l"
}, {
  "name": "illiliter",
  "symbol": "ml"
}, {
  "name": "centiliter",
  "symbol": "cl"
}, {
  "name": "deciliter",
  "symbol": "dl"
}, {
  "name": "barrel",
  "symbol": "bbl"
}, {
  "name": "hogshead",
  "symbol": "hogshead"
}];
exports.fluids = fluids;
const all = [{
  "name": "point",
  "symbol": "p"
}, {
  "name": "pica",
  "symbol": "P̸"
}, {
  "name": "inch",
  "symbol": "\""
}, {
  "name": "foot",
  "symbol": "'"
}, {
  "name": "yard",
  "symbol": "yd"
}, {
  "name": "mile",
  "symbol": "mi"
}, {
  "name": "link",
  "symbol": "li"
}, {
  "name": "rod",
  "symbol": "rd"
}, {
  "name": "chain",
  "symbol": "ch"
}, {
  "name": "furlong",
  "symbol": "fur"
}, {
  "name": "league",
  "symbol": "lea"
}, {
  "name": "fathom",
  "symbol": "ftm"
}, {
  "name": "cable",
  "symbol": "ftm"
}, {
  "name": "nautical mile",
  "symbol": "nmi"
}, {
  "name": "square foot",
  "symbol": "sqft"
}, {
  "name": "square meter",
  "symbol": "sqm"
}, {
  "name": "square chain",
  "symbol": "sqch"
}, {
  "name": "acre",
  "symbol": "acre"
}, {
  "name": "section",
  "symbol": "sq mile"
}, {
  "name": "township",
  "symbol": "twp"
}, {
  "name": "cubic inch",
  "symbol": "cu in"
}, {
  "name": "cubic foot",
  "symbol": "cu ft"
}, {
  "name": "cubic yard",
  "symbol": "cu yd"
}, {
  "name": "acre-foot",
  "symbol": "acre ft"
}, {
  "name": "minim",
  "symbol": "min"
}, {
  "name": "US fluid dram",
  "symbol": "fl dr"
}, {
  "name": "teaspoon",
  "symbol": "tsp"
}, {
  "name": "tablespoon",
  "symbol": "Tbsp"
}, {
  "name": "US fluid ounce",
  "symbol": "fl oz"
}, {
  "name": "US shot",
  "symbol": "jig"
}, {
  "name": "US gill",
  "symbol": "gi"
}, {
  "name": "US cup",
  "symbol": "cp"
}, {
  "name": "US pint",
  "symbol": "pt"
}, {
  "name": "US quart",
  "symbol": "qt"
}, {
  "name": "US gallon",
  "symbol": "gal"
}, {
  "name": "liter",
  "symbol": "l"
}, {
  "name": "illiliter",
  "symbol": "ml"
}, {
  "name": "centiliter",
  "symbol": "cl"
}, {
  "name": "deciliter",
  "symbol": "dl"
}, {
  "name": "barrel",
  "symbol": "bbl"
}, {
  "name": "hogshead",
  "symbol": "hogshead"
}, {
  "name": "pint",
  "symbol": "pt"
}, {
  "name": "quart",
  "symbol": "qt"
}, {
  "name": "gallon",
  "symbol": "gal"
}, {
  "name": "peck",
  "symbol": "pk"
}, {
  "name": "bushel",
  "symbol": "bu"
}, {
  "name": "gram",
  "symbol": "g"
}, {
  "name": "kilogram",
  "symbol": "kg"
}, {
  "name": "grain",
  "symbol": "gr"
}, {
  "name": "denier",
  "symbol": "den"
}, {
  "name": "tex",
  "symbol": "tex"
}, {
  "name": "decitex",
  "symbol": "dtex"
}, {
  "name": "dram",
  "symbol": "dr"
}, {
  "name": "ounce",
  "symbol": "oz"
}, {
  "name": "pound",
  "symbol": "lb"
}, {
  "name": "hundredweight",
  "symbol": "cwt"
}, {
  "name": "tom",
  "symbol": "ton"
}, {
  "name": "pennyweight",
  "symbol": "dwt"
}, {
  "name": "troy ounce",
  "symbol": "oz t"
}, {
  "name": "troy pound",
  "symbol": "lb t"
}, {
  "name": "mommes",
  "symbol": "mm"
}, {
  "name": "millimeter",
  "symbol": "mm"
}, {
  "name": "centimeter",
  "symbol": "cm"
}, {
  "name": "decimeter",
  "symbol": "dm"
}, {
  "name": "kilometer",
  "symbol": "km"
}];
const amounts = [...fluids, ...areas, ...lengths];
exports.amounts = amounts;

const getAmount = () => {
  return amounts[(0, _helpers.getRandomInt)(0, amounts.length - 1)];
};

exports.getAmount = getAmount;

const getDimension = () => {
  return lengths[(0, _helpers.getRandomInt)(0, lengths.length - 1)];
};

exports.getDimension = getDimension;

const getWeight = () => {
  return weights[(0, _helpers.getRandomInt)(0, weights.length - 1)];
};

exports.getWeight = getWeight;

const getArea = () => {
  return areas[(0, _helpers.getRandomInt)(0, areas.length - 1)];
};

exports.getArea = getArea;

var _default = (n = 1, overrides = {}) => (0, _helpers.generate)(() => generateUOM(overrides), n);

exports.default = _default;