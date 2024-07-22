import { Contract } from 'ethers';
export interface ICcsmService {
  connectToContract(): Promise<Contract>;
  storeAnchorHash(
    workstepInstanceId: string,
    anchorHash: string,
  ): Promise<void>;
  getAnchorHash(workstepInstanceId: string): Promise<string>;
}
