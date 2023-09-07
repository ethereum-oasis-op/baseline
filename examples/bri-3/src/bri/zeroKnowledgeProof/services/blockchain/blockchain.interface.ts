export interface IBlockchainService {
  deployContract(contractName: string): Promise<void>;
  storeAnchorHash(contractName: string, anchorHash: string): Promise<void>;
}
