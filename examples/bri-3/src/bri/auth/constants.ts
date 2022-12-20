export const jwtConstants = {
  expiresIn: 60 * 60 * 1000, // 60 min
};

export const errorMessage = {
  USER_NOT_AUTHORIZED: 'User not authorized',
  USER_NOT_FOUND: 'User not found',
};

export const didResolverProviderConfig = {
  networks: [{ name: '0x5', rpcUrl: process.env.GOERLI_RPC_URL }],
};
