import { Provide } from './providers/provide';
import { Ethers } from './providers/ethers.js';
import { MerkleTreeNode } from './utils/merkle-tree';

export const blockchainProviderEthers = 'ethers';
export const blockchainProviderProvide = 'provide';

export interface IBaselineRPC {
  // Deploy a shield contract given the compiled artifact bytecode and ABI
  deploy(sender: string, bytecode: string, abi: any): Promise<any>;

  // Retrieve a single leaf from a tree at the given shield contract address
  getLeaf(address: string, index: number): Promise<MerkleTreeNode>;

  // Retrieve multiple leaves from a tree at the given shield contract address
  getLeaves(address: string, indexes: number[]): Promise<MerkleTreeNode[]>;

  // Retrieve the root of a tree at the given shield contract address
  getRoot(address: string): Promise<string>;

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

  // Verify a sibling path for a given root and leaf at the given shield contract address
  verify(address: string, root: string, leaf: string, siblingPath: MerkleTreeNode[]): Promise<boolean>;
}

export interface IBlockchainService {
  broadcast(tx: string): Promise<any>;
  fetchTxReceipt(hash: string): Promise<any>;
  generateKeypair(): Promise<any>;
  sign(payload: string): Promise<any>;

  // generateHDWallet(): Promise<any>;
  // deriveAddress(index: number, chain?: number): Promise<any>;
  // deriveHardened(purpose: number, coin: number, account: number): Promise<any>;
}

export {
  MerkleTreeNode
};

export async function blockchainServiceFactory(
  provider: string,
  config?: any,
): Promise<IBaselineRPC & IBlockchainService> {
  let service;

  switch (provider) {
    case blockchainProviderEthers:
      service = await new Ethers(config);
      break;
    case blockchainProviderProvide:
      service = await new Provide(config);
      break;
    default:
      throw new Error('blockchain service provider required');
  }

  return service;
}
