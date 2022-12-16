export const jwtConstants = {
  expiresIn: '3600s',
};

export const errorMessage = {
  USER_NOT_AUTHORIZED: 'User not authorized',
  USER_NOT_FOUND: 'User not found',
};

export const didResolverProviderConfig = {
  networks: [{ name: '0x5', rpcUrl: process.env.GOERLI_RPC_URL }],
};
