import { GraphQLScalarType, Kind } from 'graphql';
import { isAddress } from 'web3-utils';

const Address = new GraphQLScalarType({
  name: 'Address',
  description: 'An account address',
  serialize: String,
  parseValue: input => (isAddress(input) ? input : undefined),
  parseLiteral: ast => {
    if (ast.kind !== Kind.STRING || !isAddress(ast.value)) {
      return undefined;
    }
    return String(ast.value);
  },
});

const roles = ['buyer', 'supplier', 'carrier'];
const Role = new GraphQLScalarType({
  name: 'Role',
  description: 'A user role',
  serialize: String,
  parseValue: input => {
    return roles.includes(input.toLowerCase()) ? input : undefined;
  },
  parseLiteral: ast => {
    if (ast.kind !== Kind.STRING) {
      return undefined;
    }
    return String(ast.value);
  },
});

export default {
  Address,
  Role,
};
