import { Ethers } from './providers/ethers.js';
import { Provide } from './providers/provide';
import { Rpc } from './providers/rpc';
import { Commitment } from './utils/commitment';
import { MerkleTreeNode } from './utils/merkle-tree';
import { PushCommitmentResponse } from './utils/push-commitment-response';

export const baselineProviderEthers = 'ethers';
export const baselineProviderProvide = 'provide';
export const baselineProviderRpc = 'rpc';

export interface IBaselineRPC {
  // Retrieve a single commit at the given shield contract address
  getCommit(address: string, index: number): Promise<Commitment>;

  // Retrieve multiple commits at the given shield contract address
  getCommits(address: string, startIndex: number, count: number): Promise<Commitment[]>;

  // Retrieve the root at the given shield contract address
  getRoot(address: string): Promise<string>;

  // Retrieve membership proof for the given commit index at the given shield contract address
  getProof(address: string, leafIndex: number): Promise<Commitment[]>;

  // Retrieve a list of the shield contract addresses being tracked and persisted
  getTracked(): Promise<string[]>;

  // Initialize and track changes at the given shield contract address
  track(address: string): Promise<boolean>;

  // Remove event listeners for a given shield contract address; if prune === true, wipe it from storage
  untrack(address: string, prune?: boolean): Promise<boolean>;

  // Verify a sibling path for a given root and commit at the given shield contract address
  verify(address: string, root: string, commit: string, siblingPath: Commitment[]): Promise<boolean>;

  // Atomically verify and insert a single commit at the given shield contract address
  verifyAndPush(sender: string, address: string, proof: number[], publicInputs: string[], value: string): Promise<PushCommitmentResponse>;
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
  Commitment,
  PushCommitmentResponse,
  MerkleTreeNode,
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
