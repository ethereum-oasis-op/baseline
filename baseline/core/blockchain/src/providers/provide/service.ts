import { Ident, RpcClient, Vault } from 'provide-js';
import { ProvideConfig } from './config';
import { IBaselineRPC, IBlockchainService, MerkleTreeNode } from '../..';

/**
 * This class provides unified access to various microservices
 * made available by the Provide stack as well as the configured
 * JSON-RPC service.
 */
export class Provide implements IBaselineRPC, IBlockchainService {

  // Baseline RPC client
  private rpc: RpcClient;

  // Ident provides enterprise-grade authn and authz to the baseline workgroup
  private ident: Ident | undefined;

  // Vault provides enterprise-grade key management and is used by Ident and Nethermind to sign transactions
  private vault: Vault | undefined;

  // FIXME -- add ident/vault wires as needed to complete baseline-app RI

  constructor(
    private readonly config: ProvideConfig,
  ) {
    if (config && config.token) {
      this.ident = Ident.clientFactory(config.token);
      this.vault = Vault.clientFactory(config.token);
    }

    this.rpc = new RpcClient(config?.rpcScheme, config?.rpcEndpoint);
  }

  // BaselineRPC impl

  async deploy(sender: string, bytecode: string, abi: any): Promise<any> {
    return await this.rpc.call('baseline_deploy', [sender, bytecode, abi]);
  }

  async getLeaf(address: string, index: number): Promise<MerkleTreeNode> {
    return await this.rpc.call('baseline_getLeaf', [address, index]);
  }

  async getLeaves(address: string, indexes: number[]): Promise<MerkleTreeNode[]> {
    return await this.rpc.call('baseline_getLeaves', [address, indexes]);
  }

  async getRoot(address: string): Promise<string> {
    return await this.rpc.call('baseline_getRoot', [address]);
  }

  async getSiblings(address: string, leafIndex: number): Promise<MerkleTreeNode[]> {
    return await this.rpc.call('baseline_getSiblings', [address, leafIndex]);
  }

  async getTracked(): Promise<string[]> {
    return await this.rpc.call('baseline_getTracked', []);
  }

  async insertLeaf(sender: string, address: string, value: string): Promise<MerkleTreeNode> {
    return await this.rpc.call('baseline_insertLeaf', [sender, address, value]);
  }

  async insertLeaves(sender: string, address: string, value: string): Promise<MerkleTreeNode> {
    return await this.rpc.call('baseline_insertLeaves', [sender, address, value]);
  }

  async track(address: string): Promise<boolean> {
    return await this.rpc.call('baseline_track', [address]);
  }

  async verify(address: string, root: string, leaf: string, siblingPath: MerkleTreeNode[]): Promise<boolean> {
    return await this.rpc.call('baseline_verify', [address, root, leaf, siblingPath]);
  }

  // IBlockchainService impl

  async broadcast(tx: string): Promise<any> {
    return this.rpc.call('eth_sendRawTransaction', [tx]);
  }

  async fetchTxReceipt(hash: string): Promise<any> {
    return this.rpc.call('eth_getTransactionReceipt', [hash]);
  }

  async generateKeypair(): Promise<any> {
    return Promise.reject('generateKeypair() not yet implemented');
  }

  async rpcExec(method: string, params: any[]): Promise<any> {
    return this.rpc.call(method, params);
  }

  async sign(params: any): Promise<any> {
    return this.rpc.call('eth_signTransaction', [params]);
  }
}
