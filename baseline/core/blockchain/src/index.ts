import { ProvideService } from './providers/provide';
import { EthersService } from './providers/ethers.js';

export const blockchainProviderEthers = 'ethers';
export const blockchainProviderProvide = 'provide';

export interface IBlockchainService {
  broadcast(tx: string): Promise<any>;
  fetchTxReceipt(hash: string): Promise<any>;
  generateKeyPair(): Promise<any>;
  sign(payload: string): Promise<any>;

  // TODO: add to interface:
  // generatdeHDWallet(): Promise<any>;
  // deriveAddress(index: number, chain?: number): Promise<any>;
  // deriveHardened(purpose: number, coin: number, account: number): Promise<any>;
}

export async function blockchainServiceFactory(
  provider: string,
  config?: any,
): Promise<IBlockchainService> {
  let service;

  switch (provider) {
    case blockchainProviderEthers:
      service = await new EthersService(config);
      break;
    case blockchainProviderProvide:
      service = await new ProvideService(config);
      break;
    default:
      throw new Error('blockchain service provider required');
  }

  return service;
}
