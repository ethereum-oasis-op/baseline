import { company, finance } from 'faker';
import { generate } from './helpers';

const generatePartner = overrides => ({
  name: company.companyName(),
  address: finance.ethereumAddress(),
  ...overrides,
});

export default (n = 1, overrides = {}) => generate(() => generatePartner(overrides), n);
