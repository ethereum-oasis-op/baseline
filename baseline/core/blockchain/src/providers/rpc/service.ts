import { RpcClient } from 'provide-js';
import { RpcConfig } from './config';
import { IBaselineRPC, IBlockchainService, MerkleTreeNode } from '../..';

/**
 * This class provides a generic JSON-RPC service.
 */
export class Rpc implements IBaselineRPC, IBlockchainService {

  // RPC client
  private client: RpcClient;

  constructor(
    private readonly config: RpcConfig,
  ) {
    this.client = new RpcClient(config?.rpcScheme, config?.rpcEndpoint);
  }

  // BaselineRPC impl

  async deploy(sender: string, bytecode: string, abi: any): Promise<any> {
    return await this.client.call('baseline_deploy', [sender, bytecode, abi]);
  }

  async getLeaf(address: string, index: number): Promise<MerkleTreeNode> {
    return await this.client.call('baseline_getLeaf', [address, index]);
  }

  async getLeaves(address: string, indexes: number[]): Promise<MerkleTreeNode[]> {
    return await this.client.call('baseline_getLeaves', [address, indexes]);
  }

  async getRoot(address: string): Promise<string> {
    return await this.client.call('baseline_getRoot', [address]);
  }

  async getSiblings(address: string, leafIndex: number): Promise<MerkleTreeNode[]> {
    return await this.client.call('baseline_getSiblings', [address, leafIndex]);
  }

  async getTracked(): Promise<string[]> {
    return await this.client.call('baseline_getTracked', []);
  }

  async insertLeaf(sender: string, address: string, value: string): Promise<MerkleTreeNode> {
    return await this.client.call('baseline_insertLeaf', [sender, address, value]);
  }

  async insertLeaves(sender: string, address: string, value: string): Promise<MerkleTreeNode> {
    return await this.client.call('baseline_insertLeaves', [sender, address, value]);
  }

  async track(address: string): Promise<boolean> {
    return await this.client.call('baseline_track', [address]);
  }

  async verify(address: string, root: string, leaf: string, siblingPath: MerkleTreeNode[]): Promise<boolean> {
    return await this.client.call('baseline_verify', [address, root, leaf, siblingPath]);
  }

  // IBlockchainService impl

  async broadcast(tx: string): Promise<any> {
    return this.client.call('eth_sendRawTransaction', [tx]);
  }

  async fetchTxReceipt(hash: string): Promise<any> {
    return this.client.call('eth_getTransactionReceipt', [hash]);
  }

  async exec(method: string, params: any[]): Promise<any> {
    return this.client.call(method, params);
  }

  async generateKeypair(): Promise<any> {
    return Promise.reject('generateKeypair() not yet implemented');
  }

  async rpcExec(method: string, params: any[]): Promise<any> {
    return this.exec(method, params);
  }

  async sign(params: any): Promise<any> {
    return this.client.call('eth_signTransaction', [params]);
  }
}
