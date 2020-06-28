import { ProvideService } from './providers/provide';
import { EthersService } from './providers/ethers.js';
import { MerkleTreeNode } from './utils/merkle-tree';

export const blockchainProviderEthers = 'ethers';
export const blockchainProviderProvide = 'provide';

export interface IBlockchainService {
  broadcast(tx: string): Promise<any>;
  fetchTxReceipt(hash: string): Promise<any>;
  generateKeyPair(): Promise<any>;
  sign(payload: string): Promise<any>;

  // TODO: add to interface:
  // generatdeHDWallet(): Promise<any>;
  // deriveAddress(index: number, chain?: number): Promise<any>;
  // deriveHardened(purpose: number, coin: number, account: number): Promise<any>;
}

export interface IBaselineRPC {
  // Deploy a shield contract given the compiled artifact bytecode and ABI
  deploy(sender: string, bytecode: string, abi: any): Promise<any>;

  // Retrieve a single leaf from a tree at the given shield contract address
  getLeaf(address: string, index: number): Promise<MerkleTreeNode>;

  // Retrieve multiple leaves from a tree at the given shield contract address
  getLeaves(address: string, indexes: number[]): Promise<MerkleTreeNode[]>;

  // Retrieve sibling paths/proof of the given leaf index
  getSiblings(leafIndex: number): Promise<MerkleTreeNode[]>;

  // Retrieve a list of the shield contract addresses being tracked and persisted
  getTracked(): Promise<string[]>;

  // Inserts a single leaf in a tree at the given shield contract address
  insertLeaf(sender: string, address: string, value: string): Promise<MerkleTreeNode>;

  // Inserts multiple leaves in a tree at the given shield contract address
  insertLeaves(sender: string, address: string, value: string): Promise<MerkleTreeNode>;

  // Initialize a merkle tree database and track changes at the given shield contract address
  track(address: string): Promise<boolean>;
}

export async function blockchainServiceFactory(
  provider: string,
  config?: any,
): Promise<IBlockchainService> {
  let service;

  switch (provider) {
    case blockchainProviderEthers:
      service = await new EthersService(config);
      break;
    case blockchainProviderProvide:
      service = await new ProvideService(config);
      break;
    default:
      throw new Error('blockchain service provider required');
  }

  return service;
}
