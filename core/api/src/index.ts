import { Ethers } from './providers/ethers.js';
import { Provide } from './providers/provide';
import { Rpc } from './providers/rpc';
import { MerkleTreeNode } from './utils/merkle-tree';

export const baselineProviderEthers = 'ethers';
export const baselineProviderProvide = 'provide';
export const baselineProviderRpc = 'rpc';

export interface IBaselineRPC {
  // Deploy a shield contract given the compiled artifact bytecode and ABI
  deploy(sender: string, bytecode: string, abi: any): Promise<any>;

  // Retrieve a single leaf from a tree at the given shield contract address
  getLeaf(address: string, index: number): Promise<MerkleTreeNode>;

  // Retrieve multiple leaves from a tree at the given shield contract address
  getLeaves(address: string, indexes: number[]): Promise<MerkleTreeNode[]>;

  // Retrieve the root of a tree at the given shield contract address
  getRoot(address: string): Promise<string>;

  // Retrieve sibling paths/proof of the given leaf index at the given shield contract address
  getSiblings(address: string, leafIndex: number): Promise<MerkleTreeNode[]>;

  // Retrieve a list of the shield contract addresses being tracked and persisted
  getTracked(): Promise<string[]>;

  // Inserts a single leaf in a tree at the given shield contract address
  insertLeaf(sender: string, address: string, value: string): Promise<MerkleTreeNode>;

  // Inserts multiple leaves in a tree at the given shield contract address
  insertLeaves(sender: string, address: string, value: string): Promise<MerkleTreeNode>;

  // Initialize a merkle tree database and track changes at the given shield contract address
  track(address: string): Promise<boolean>;

  // Verify a sibling path for a given root and leaf at the given shield contract address
  verify(address: string, root: string, leaf: string, siblingPath: MerkleTreeNode[]): Promise<boolean>;
}

export interface IBlockchainService {
  broadcast(tx: string): Promise<any>;
  fetchTxReceipt(hash: string): Promise<any>;
  generateKeypair(): Promise<any>;
  rpcExec(method: string, params: any[]): Promise<any>;
  sign(payload: string): Promise<any>;
}

export interface IRegistry {
  // workgroups
  createWorkgroup(params: object): Promise<any>;
  updateWorkgroup(workgroupId: string, params: object): Promise<any>;
  fetchWorkgroups(params: object): Promise<any>;
  fetchWorkgroupDetails(workgroupId: string): Promise<any>;
  fetchWorkgroupOrganizations(workgroupId: string, params: object): Promise<any>;
  createWorkgroupOrganization(workgroupId: string, params: object): Promise<any>;
  updateWorkgroupOrganization(workgroupId: string, organizationId: string, params: object): Promise<any>;
  fetchWorkgroupInvitations(workgroupId: string, params: object): Promise<any>;
  fetchWorkgroupUsers(workgroupId: string, params: object): Promise<any>;
  createWorkgroupUser(workgroupId: string, params: object): Promise<any>;
  updateWorkgroupUser(workgroupId: string, userId: string, params: object): Promise<any>;
  deleteWorkgroupUser(workgroupId: string, userId: string): Promise<any>;

  // organizations
  createOrganization(params: object): Promise<any>;
  fetchOrganizations(params: object): Promise<any>;
  fetchOrganizationDetails(organizationId: string): Promise<any>;
  updateOrganization(organizationId: string, params: object): Promise<any>;

  // organization users
  fetchOrganizationInvitations(organizationId: string, params: object): Promise<any>;
  fetchOrganizationUsers(organizationId: string, params: object): Promise<any>;
  inviteOrganizationUser(organizationId: string, params: object): Promise<any>;
}

export interface IVault {
  createVault(params: object): Promise<any>;
  fetchVaults(params: object): Promise<any>;
  fetchVaultKeys(vaultId: string, params: object): Promise<any>;
  createVaultKey(vaultId: string, params: object): Promise<any>;
  deleteVaultKey(vaultId: string, keyId: string): Promise<any>;
  encrypt(vaultId: string, keyId: string, payload: string): Promise<any>;
  decrypt(vaultId: string, keyId: string, payload: string): Promise<any>;
  signMessage(vaultId: string, keyId: string, msg: string): Promise<any>;
  verifySignature(vaultId: string, keyId: string, msg: string, sig: string): Promise<any>;
  fetchVaultSecrets(vaultId: string, params: object): Promise<any>;
  createVaultSecret(vaultId: string, params: object): Promise<any>;
  deleteVaultSecret(vaultId: string, secretId: string): Promise<any>;
}

export {
  MerkleTreeNode
};

export async function baselineServiceFactory(
  provider: string,
  config?: any,
): Promise<IBaselineRPC & IBlockchainService & IRegistry & IVault> {
  let service;

  switch (provider) {
    case baselineProviderEthers:
      service = new Ethers(config);
      break;
    case baselineProviderProvide:
      service = new Provide(config);
      break;
    case baselineProviderRpc:
      service = new Rpc(config);
      break;
    default:
      throw new Error('blockchain service provider required');
  }

  return service;
}
