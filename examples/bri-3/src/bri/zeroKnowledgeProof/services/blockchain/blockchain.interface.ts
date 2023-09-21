import { Contract } from 'ethers';
export interface IBlockchainService {
  deployContract(contractName: string): Promise<void>;
  connectToContract(contractName: string): Promise<Contract>;
  storeAnchorHash(contractName: string, anchorHash: string): Promise<void>;
}
