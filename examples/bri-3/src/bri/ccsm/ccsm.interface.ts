import { Contract } from 'ethers';
export interface ICcsmService {
  deployContract(): Promise<void>;
  connectToContract(options: { readonly: boolean }): Promise<Contract>;
  storeAnchorHash(workgroupId: string, anchorHash: string): Promise<void>;
  getAnchorHash(workgroupId: string): Promise<string>;
}
