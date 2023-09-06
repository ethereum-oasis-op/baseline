export interface IBlockchainService {
  deployContract(): Promise<void>;
  storeAnchorHash(anchorHash: string): Promise<void>;
}
