import { RpcClient } from 'provide-js';
import { RpcConfig } from './config';
import { IBaselineRPC, IBlockchainService, MerkleTreeNode, IRegistry, IVault } from '../..';

/**
 * This class provides a generic JSON-RPC service.
 */
export class Rpc implements IBaselineRPC, IBlockchainService, IRegistry, IVault {

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

  // IRegistry

  createWorkgroup(params: object): Promise<any> {
    throw new Error('not implemented');
  }
  updateWorkgroup(workgroupId: string, params: object): Promise<any> {
    throw new Error('not implemented');
  }
  fetchWorkgroups(params: object): Promise<any> {
    throw new Error('not implemented');
  }
  fetchWorkgroupDetails(workgroupId: string): Promise<any> {
    throw new Error('not implemented');
  }
  fetchWorkgroupOrganizations(workgroupId: string, params: object): Promise<any> {
    throw new Error('not implemented');
  }
  createWorkgroupOrganization(workgroupId: string, params: object): Promise<any> {
    throw new Error('not implemented');
  }
  updateWorkgroupOrganization(workgroupId: string, organizationId: string, params: object): Promise<any> {
    throw new Error('not implemented');
  }
  fetchWorkgroupInvitations(workgroupId: string, params: object): Promise<any> {
    throw new Error('not implemented');
  }
  fetchWorkgroupTokens(workgroupId: string): Promise<any> {
    throw new Error('not implemented');
  }
  fetchWorkgroupUsers(workgroupId: string, params: object): Promise<any> {
    throw new Error('not implemented');
  }
  createWorkgroupUser(workgroupId: string, params: object): Promise<any> {
    throw new Error('not implemented');
  }
  updateWorkgroupUser(workgroupId: string, userId: string, params: object): Promise<any> {
    throw new Error('not implemented');
  }
  deleteWorkgroupUser(workgroupId: string, userId: string): Promise<any> {
    throw new Error('not implemented');
  }
  createOrganization(params: object): Promise<any> {
    throw new Error('not implemented');
  }
  fetchOrganizations(params: object): Promise<any> {
    throw new Error('not implemented');
  }
  fetchOrganizationDetails(organizationId: string): Promise<any> {
    throw new Error('not implemented');
  }
  updateOrganization(organizationId: string, params: object): Promise<any> {
    throw new Error('not implemented');
  }
  fetchOrganizationInvitations(organizationId: string, params: object): Promise<any> {
    throw new Error('not implemented');
  }
  fetchOrganizationUsers(organizationId: string, params: object): Promise<any> {
    throw new Error('not implemented');
  }
  createOrganizationUser(organizationId: string, params: object): Promise<any> {
    throw new Error('not implemented');
  }
  updateOrganizationUser(organizationId: string, userId: string, params: object): Promise<any> {
    throw new Error('not implemented');
  }
  deleteOrganizationUser(organizationId: string, userId: string): Promise<any> {
    throw new Error('not implemented');
  }
  createToken(params: object): Promise<any> {
    throw new Error('not implemented');
  }
  fetchTokens(params: object): Promise<any> {
    throw new Error('not implemented');
  }
  deleteToken(tokenId: string): Promise<any> {
    throw new Error('not implemented');
  }
  createInvitation(params: object): Promise<any> {
    throw new Error('not implemented');
  }
  createUser(params: object): Promise<any> {
    throw new Error('not implemented');
  }
  fetchUsers(): Promise<any> {
    throw new Error('not implemented');
  }
  fetchUserDetails(userId: string): Promise<any> {
    throw new Error('not implemented');
  }
  updateUser(userId: string, params: object): Promise<any> {
    throw new Error('not implemented');
  }

  // IVault

  createVault(params: object): Promise<any> {
    throw new Error('not implemented');
  }
  fetchVaults(params: object): Promise<any> {
    throw new Error('not implemented');
  }
  fetchVaultKeys(vaultId: string, params: object): Promise<any> {
    throw new Error('not implemented');
  }
  createVaultKey(vaultId: string, params: object): Promise<any> {
    throw new Error('not implemented');
  }
  deleteVaultKey(vaultId: string, keyId: string): Promise<any> {
    throw new Error('not implemented');
  }
  encrypt(vaultId: string, keyId: string, payload: string): Promise<any> {
    throw new Error('not implemented');
  }
  decrypt(vaultId: string, keyId: string, payload: string): Promise<any> {
    throw new Error('not implemented');
  }
  signMessage(vaultId: string, keyId: string, msg: string): Promise<any> {
    throw new Error('not implemented');
  }
  verifySignature(vaultId: string, keyId: string, msg: string, sig: string): Promise<any> {
    throw new Error('not implemented');
  }
  fetchVaultSecrets(vaultId: string, params: object): Promise<any> {
    throw new Error('not implemented');
  }
  createVaultSecret(vaultId: string, params: object): Promise<any> {
    throw new Error('not implemented');
  }
  deleteVaultSecret(vaultId: string, secretId: string): Promise<any> {
    throw new Error('not implemented');
  }
}
