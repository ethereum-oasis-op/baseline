import { ethers } from 'ethers';
import { IBlockchainService } from '../..';

export class EthersService implements IBlockchainService {

  // private config: any;

  constructor(
    private readonly config: any,
  ) {
    // this.config = config;
  }

  async fetchTxReceipt(hash: string): Promise<any> {
    throw new Error('impl pending');
  }

  async generateKeyPair(): Promise<any> {
    throw new Error('impl pending');
  }

  async broadcast(tx: string): Promise<any> {
    throw new Error('impl pending');
  }

  async sign(payload: string): Promise<any> {
    throw new Error('impl pending');
  }
}
