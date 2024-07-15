import { Contract } from 'ethers';
export interface ICcsmService {
  // TODO: No need for deploy method. check discussion here https://github.com/ethereum-oasis-op/baseline/issues/751
  // there is one contract per BPI and we can assume that it is manually deployed during BPI setup
  deployContract(): Promise<void>;
  connectToContract(options: { readonly: boolean }): Promise<Contract>;
  storeAnchorHash(workgroupId: string, anchorHash: string): Promise<void>;
  getAnchorHash(workgroupId: string): Promise<string>;
}
