import { ethers } from 'ethers';
import { IBlockchainService } from '../..';

export class Ethers implements IBlockchainService {

  // private config: any;

  constructor(
    private readonly config: any,
  ) {
    // this.config = config;
  }

  async fetchTxReceipt(hash: string): Promise<any> {
    throw new Error('not implemented');
  }

  async generateKeypair(): Promise<any> {
    throw new Error('not implemented');
  }

  async broadcast(tx: string): Promise<any> {
    throw new Error('not implemented');
  }

  async rpcExec(method: string, params: any[]): Promise<any> {
    throw new Error('not implemented');
  }

  async sign(payload: string): Promise<any> {
    throw new Error('not implemented');
  }
}
