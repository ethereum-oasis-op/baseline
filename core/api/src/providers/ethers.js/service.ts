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
  inviteOrganizationUser(organizationId: string, params: object): Promise<any> {
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
