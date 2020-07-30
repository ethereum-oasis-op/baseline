// tslint:disable: no-non-null-assertion

import { Ident, RpcClient, Vault } from 'provide-js';
import { ProvideConfig } from './config';
import { IBaselineRPC, IBlockchainService, MerkleTreeNode, IRegistry, IVault } from '../..';

/**
 * This class provides unified access to various microservices
 * made available by the Provide stack as well as the configured
 * JSON-RPC service.
 */
export class Provide implements IBaselineRPC, IBlockchainService, IRegistry, IVault {

  // Baseline RPC client
  private rpc: RpcClient;

  // Ident provides enterprise-grade authn and authz to the baseline workgroup
  private ident?: Ident;

  // Vault provides enterprise-grade key management and is used by Ident and Nethermind to sign transactions
  private vault?: Vault;

  constructor(
    private readonly config: ProvideConfig,
  ) {
    if (config && config.token) {
      this.ident = Ident.clientFactory(config.token, config.identApiScheme, config.identApiHost);
      this.vault = Vault.clientFactory(config.token, config.vaultApiScheme, config.vaultApiHost);
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

  // IRegistry

  createWorkgroup(params: object): Promise<any> {
    return this.ident!.createApplication(params);
  }

  updateWorkgroup(workgroupId: string, params: object): Promise<any> {
    return this.ident!.updateApplication(workgroupId, params);
  }

  fetchWorkgroups(params: object): Promise<any> {
    return this.ident!.fetchApplications(params);
  }

  fetchWorkgroupDetails(workgroupId: string): Promise<any> {
    return this.ident!.fetchApplicationDetails(workgroupId);
  }

  fetchWorkgroupOrganizations(workgroupId: string, params: object): Promise<any> {
    return this.ident!.fetchApplicationOrganizations(workgroupId, params);
  }

  createWorkgroupOrganization(workgroupId: string, params: object): Promise<any> {
    return this.ident!.createApplicationOrganization(workgroupId, params);
  }

  updateWorkgroupOrganization(workgroupId: string, organizationId: string, params: object): Promise<any> {
    return this.ident!.updateApplicationOrganization(workgroupId, organizationId, params);
  }

  fetchWorkgroupInvitations(workgroupId: string, params: object): Promise<any> {
    return this.ident!.fetchApplicationInvitations(workgroupId, params);
  }

  fetchWorkgroupUsers(workgroupId: string, params: object): Promise<any> {
    return this.ident!.fetchApplicationUsers(workgroupId, params);
  }

  createWorkgroupUser(workgroupId: string, params: object): Promise<any> {
    return this.ident!.createApplicationUser(workgroupId, params);
  }

  updateWorkgroupUser(workgroupId: string, userId: string, params: object): Promise<any> {
    return this.ident!.updateApplicationUser(workgroupId, userId, params);
  }

  deleteWorkgroupUser(workgroupId: string, userId: string): Promise<any> {
    return this.ident!.deleteApplicationUser(workgroupId, userId);
  }

  createOrganization(params: object): Promise<any> {
    return this.ident!.createOrganization(params);
  }

  fetchOrganizations(params: object): Promise<any> {
    return this.ident!.fetchOrganizations(params);
  }

  fetchOrganizationDetails(organizationId: string): Promise<any> {
    return this.ident!.fetchOrganizationDetails(organizationId);
  }

  updateOrganization(organizationId: string, params: object): Promise<any> {
    return this.ident!.updateOrganization(organizationId, params);
  }

  fetchOrganizationInvitations(organizationId: string, params: object): Promise<any> {
    return this.ident!.fetchOrganizationInvitations(organizationId, params);
  }

  fetchOrganizationUsers(organizationId: string, params: object): Promise<any> {
    return this.ident!.fetchOrganizationUsers(organizationId, params);
  }

  inviteOrganizationUser(organizationId: string, params: object): Promise<any> {
    return this.ident!.createOrganizationUser(organizationId, params);
  }

  // IVault

  createVault(params: object): Promise<any> {
    return this.vault!.createVault(params);
  }

  fetchVaults(params: object): Promise<any> {
    return this.vault!.fetchVaults(params);
  }

  fetchVaultKeys(vaultId: string, params: object): Promise<any> {
    return this.vault!.fetchVaultKeys(vaultId, params);
  }

  createVaultKey(vaultId: string, params: object): Promise<any> {
    return this.vault!.createVaultKey(vaultId, params);
  }

  deleteVaultKey(vaultId: string, keyId: string): Promise<any> {
    return this.vault!.deleteVaultKey(vaultId, keyId);
  }

  encrypt(vaultId: string, keyId: string, payload: string): Promise<any> {
    return this.vault!.encrypt(vaultId, keyId, payload);
  }

  decrypt(vaultId: string, keyId: string, payload: string): Promise<any> {
    return this.vault!.decrypt(vaultId, keyId, payload);
  }

  signMessage(vaultId: string, keyId: string, msg: string): Promise<any> {
    return this.vault!.signMessage(vaultId, keyId, msg);
  }

  verifySignature(vaultId: string, keyId: string, msg: string, sig: string): Promise<any> {
    return this.vault!.verifySignature(vaultId, keyId, msg, sig);
  }

  fetchVaultSecrets(vaultId: string, params: object): Promise<any> {
    return this.vault!.fetchVaultSecrets(vaultId, params);
  }

  createVaultSecret(vaultId: string, params: object): Promise<any> {
    return this.vault!.createVaultSecret(vaultId, params);
  }

  deleteVaultSecret(vaultId: string, secretId: string): Promise<any> {
    return this.vault!.deleteVaultSecret(vaultId, secretId);
  }
}
