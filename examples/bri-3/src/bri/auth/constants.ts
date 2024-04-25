export const jwtConstants = {
  expiresIn: 60 * 60 * 1000, // 60 min
};

export const didResolverProviderConfig = {
  networks: [{ name: '0x11155111', rpcUrl: process.env.SEPOLIA_RPC_URL }],
};
