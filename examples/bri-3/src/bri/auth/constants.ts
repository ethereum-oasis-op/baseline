export const jwtConstants = {
  expiresIn: 60 * 60 * 1000, // 60 min
};

export const didResolverProviderConfig = {
  networks: [{ name: '0x5', rpcUrl: process.env.GOERLI_RPC_URL }],
};
