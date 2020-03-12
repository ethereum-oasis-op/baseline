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

const DateScalar = new GraphQLScalarType({
  name: 'Date',
  description: 'Date type scalar',
  parseValue: input => new Date(input),
  serialize: input => new Date(input).getTime(),
  parseLiteral: ast => {
    if (ast.kind === Kind.INT) {
      return new Date(ast.value)
    }
    return null;
  },
})

export default {
  Address,
  Date: DateScalar,
};
