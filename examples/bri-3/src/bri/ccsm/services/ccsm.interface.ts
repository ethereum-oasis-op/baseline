import { Contract } from 'ethers';
export interface ICcsmService {
  connectToContract(options: { readonly: boolean }): Promise<Contract>;
  storeAnchorHash(workgroupId: string, anchorHash: string): Promise<void>;
  getAnchorHash(workgroupId: string): Promise<string>;
}
