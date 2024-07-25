export interface ICcsmService {
  storeAnchorHash(
    workstepInstanceId: string,
    anchorHash: string,
  ): Promise<void>;
  getAnchorHash(workstepInstanceId: string): Promise<string>;
}
