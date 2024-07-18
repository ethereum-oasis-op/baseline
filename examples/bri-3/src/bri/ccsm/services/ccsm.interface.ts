import { Contract } from 'ethers';
export interface ICcsmService {
  connectToContract(): Promise<Contract>;
  storeAnchorHash(workgroupId: string, anchorHash: string): Promise<void>;
  getAnchorHash(workgroupId: string): Promise<string>;
}
