import axios from 'axios';
import { RpcConfig } from './config';
import { IBaselineRPC, IBlockchainService, MerkleTreeNode, IRegistry, IVault, PushCommitmentResponse, Commitment } from '../..';

const defaultJsonRpcUrl = 'http://localhost:8545';
const defaultJsonRpcVersion = '2.0';

/**
 * This class provides a generic JSON-RPC service implementing
 * the Baseline JSON-RPC API.
 */
export class Rpc implements IBaselineRPC, IBlockchainService, IRegistry, IVault {

  private id: number;
  private readonly version: string;
  private readonly url: string;

  constructor(
    private readonly config: RpcConfig,
  ) {
    this.id = 1;
    this.version = config ? config.rpcVersion : defaultJsonRpcVersion;
    this.url = config ? `${config.rpcScheme}://${config.rpcEndpoint}` : defaultJsonRpcUrl;
  }

  private async call(method: string, params: any[]): Promise<any> {
    const resp = await axios.post(this.url, {
      id: this.id++,
      method: method,
      params: params,
      jsonrpc: this.version,
    });

    const data = resp ? resp.data : null;

    if (data && typeof data.result !== 'undefined' && typeof data.error === 'undefined') {
      return data.result;
    } else if (data && typeof data.error !== 'undefined') {
      return Promise.reject(data.error);
    } else if (data) {
      return data;
    }

    return Promise.reject('failed to receive json-rpc response');
  }

  // BaselineRPC impl

  async getCommit(address: string, index: number): Promise<Commitment> {
    return await this.call('baseline_getCommit', [address, index]);
  }

  async getCommits(address: string, startIndex: number, count: number): Promise<Commitment[]> {
    return await this.call('baseline_getCommits', [address, startIndex, count]);
  }

  async getRoot(address: string): Promise<string> {
    return await this.call('baseline_getRoot', [address]);
  }

  async getProof(address: string, commitIndex: number): Promise<Commitment[]> {
    return await this.call('baseline_getProof', [address, commitIndex]);
  }

  async getTracked(): Promise<string[]> {
    return await this.call('baseline_getTracked', []);
  }

  async track(address: string): Promise<boolean> {
    return await this.call('baseline_track', [address]);
  }

  async untrack(address: string, prune?: boolean): Promise<boolean> {
    return await this.call('baseline_untrack', [address, prune]);
  }

  async verify(address: string, root: string, commit: string, siblingPath: Commitment[]): Promise<boolean> {
    return await this.call('baseline_verify', [address, root, commit, siblingPath]);
  }

  async verifyAndPush(sender: string, address: string, proof: number[], publicInputs: string[], value: string): Promise<PushCommitmentResponse> {
    return await this.call('baseline_verifyAndPush', [sender, address, proof, publicInputs, value]);
  }

  // IBlockchainService impl

  async broadcast(tx: string): Promise<any> {
    return this.call('eth_sendRawTransaction', [tx]);
  }

  async fetchTxReceipt(hash: string): Promise<any> {
    return this.call('eth_getTransactionReceipt', [hash]);
  }

  async exec(method: string, params: any[]): Promise<any> {
    return this.call(method, params);
  }

  async generateKeypair(): Promise<any> {
    return Promise.reject('generateKeypair() not yet implemented');
  }

  async rpcExec(method: string, params: any[]): Promise<any> {
    return this.exec(method, params);
  }

  async sign(params: any): Promise<any> {
    return this.call('eth_signTransaction', [params]);
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
