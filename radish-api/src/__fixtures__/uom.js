import { generate, getRandomInt } from './helpers';

export const weights = [
  { name: 'gram', symbol: 'g' },
  { name: 'kilogram', symbol: 'kg' },
  { name: 'grain', symbol: 'gr' },
  { name: 'denier', symbol: 'den' },
  { name: 'tex', symbol: 'tex' },
  { name: 'decitex', symbol: 'dtex' },
  { name: 'dram', symbol: 'dr' },
  { name: 'ounce', symbol: 'oz' },
  { name: 'pound', symbol: 'lb' },
  { name: 'hundredweight', symbol: 'cwt' },
  { name: 'tom', symbol: 'ton' },
  { name: 'pennyweight', symbol: 'dwt' },
  { name: 'troy ounce', symbol: 'oz t' },
  { name: 'troy pound', symbol: 'lb t' },
  { name: 'mommes', symbol: 'mm' },
];

export const areas = [
  { name: 'millimeter', symbol: 'mm' },
  { name: 'centimeter', symbol: 'cm' },
  { name: 'decimeter', symbol: 'dm' },
  { name: 'kilometer', symbol: 'km' },
  { name: 'square foot', symbol: 'sqft' },
  { name: 'square meter', symbol: 'sqm' },
  { name: 'square chain', symbol: 'sqch' },
  { name: 'cubic inch', symbol: 'cu in' },
  { name: 'cubic foot', symbol: 'cu ft' },
  { name: 'cubic yard', symbol: 'cu yd' },
  { name: 'acre-foot', symbol: 'acre ft' },
];

export const lengths = [
  { name: 'point', symbol: 'p' },
  { name: 'pica', symbol: 'P̸' },
  { name: 'inch', symbol: '"' },
  { name: 'foot', symbol: "'" },
  { name: 'yard', symbol: 'yd' },
  { name: 'mile', symbol: 'mi' },
  { name: 'link', symbol: 'li' },
  { name: 'rod', symbol: 'rd' },
  { name: 'chain', symbol: 'ch' },
  { name: 'cable', symbol: 'ftm' },
  { name: 'millimeter', symbol: 'mm' },
  { name: 'centimeter', symbol: 'cm' },
  { name: 'decimeter', symbol: 'dm' },
  { name: 'kilometer', symbol: 'km' },
];

export const fluids = [
  { name: 'pint', symbol: 'pt' },
  { name: 'quart', symbol: 'qt' },
  { name: 'gallon', symbol: 'gal' },
  { name: 'minim', symbol: 'min' },
  { name: 'US fluid dram', symbol: 'fl dr' },
  { name: 'teaspoon', symbol: 'tsp' },
  { name: 'tablespoon', symbol: 'Tbsp' },
  { name: 'fluid ounce', symbol: 'fl oz' },
  { name: 'cup', symbol: 'cp' },
  { name: 'liter', symbol: 'l' },
  { name: 'illiliter', symbol: 'ml' },
  { name: 'centiliter', symbol: 'cl' },
  { name: 'deciliter', symbol: 'dl' },
  { name: 'barrel', symbol: 'bbl' },
  { name: 'hogshead', symbol: 'hogshead' },
];
const all = [
  { name: 'point', symbol: 'p' },
  { name: 'pica', symbol: 'P̸' },
  { name: 'inch', symbol: '"' },
  { name: 'foot', symbol: "'" },
  { name: 'yard', symbol: 'yd' },
  { name: 'mile', symbol: 'mi' },
  { name: 'link', symbol: 'li' },
  { name: 'rod', symbol: 'rd' },
  { name: 'chain', symbol: 'ch' },
  { name: 'furlong', symbol: 'fur' },
  { name: 'league', symbol: 'lea' },
  { name: 'fathom', symbol: 'ftm' },
  { name: 'cable', symbol: 'ftm' },
  { name: 'nautical mile', symbol: 'nmi' },
  { name: 'square foot', symbol: 'sqft' },
  { name: 'square meter', symbol: 'sqm' },
  { name: 'square chain', symbol: 'sqch' },
  { name: 'acre', symbol: 'acre' },
  { name: 'section', symbol: 'sq mile' },
  { name: 'township', symbol: 'twp' },
  { name: 'cubic inch', symbol: 'cu in' },
  { name: 'cubic foot', symbol: 'cu ft' },
  { name: 'cubic yard', symbol: 'cu yd' },
  { name: 'acre-foot', symbol: 'acre ft' },
  { name: 'minim', symbol: 'min' },
  { name: 'US fluid dram', symbol: 'fl dr' },
  { name: 'teaspoon', symbol: 'tsp' },
  { name: 'tablespoon', symbol: 'Tbsp' },
  { name: 'US fluid ounce', symbol: 'fl oz' },
  { name: 'US shot', symbol: 'jig' },
  { name: 'US gill', symbol: 'gi' },
  { name: 'US cup', symbol: 'cp' },
  { name: 'US pint', symbol: 'pt' },
  { name: 'US quart', symbol: 'qt' },
  { name: 'US gallon', symbol: 'gal' },
  { name: 'liter', symbol: 'l' },
  { name: 'illiliter', symbol: 'ml' },
  { name: 'centiliter', symbol: 'cl' },
  { name: 'deciliter', symbol: 'dl' },
  { name: 'barrel', symbol: 'bbl' },
  { name: 'hogshead', symbol: 'hogshead' },
  { name: 'pint', symbol: 'pt' },
  { name: 'quart', symbol: 'qt' },
  { name: 'gallon', symbol: 'gal' },
  { name: 'peck', symbol: 'pk' },
  { name: 'bushel', symbol: 'bu' },
  { name: 'gram', symbol: 'g' },
  { name: 'kilogram', symbol: 'kg' },
  { name: 'grain', symbol: 'gr' },
  { name: 'denier', symbol: 'den' },
  { name: 'tex', symbol: 'tex' },
  { name: 'decitex', symbol: 'dtex' },
  { name: 'dram', symbol: 'dr' },
  { name: 'ounce', symbol: 'oz' },
  { name: 'pound', symbol: 'lb' },
  { name: 'hundredweight', symbol: 'cwt' },
  { name: 'tom', symbol: 'ton' },
  { name: 'pennyweight', symbol: 'dwt' },
  { name: 'troy ounce', symbol: 'oz t' },
  { name: 'troy pound', symbol: 'lb t' },
  { name: 'mommes', symbol: 'mm' },
  { name: 'millimeter', symbol: 'mm' },
  { name: 'centimeter', symbol: 'cm' },
  { name: 'decimeter', symbol: 'dm' },
  { name: 'kilometer', symbol: 'km' },
];

const generateUOM = overrides => {
  const uom = all[getRandomInt(0, all.length - 1)];
  return {
    name: uom.name,
    symbol: uom.symbol,
    ...overrides,
  };
};

export const amounts = [...fluids, ...areas, ...lengths];
export const getAmount = () => {
  return amounts[getRandomInt(0, amounts.length - 1)];
};
export const getDimension = () => {
  return lengths[getRandomInt(0, lengths.length - 1)];
};
export const getWeight = () => {
  return weights[getRandomInt(0, weights.length - 1)];
};
export const getArea = () => {
  return areas[getRandomInt(0, areas.length - 1)];
};
export default (n = 1, overrides = {}) => generate(() => generateUOM(overrides), n);
