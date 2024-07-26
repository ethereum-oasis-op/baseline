import { Witness } from '../../zeroKnowledgeProof/models/witness';

export interface ICcsmService {
  storeAnchorHash(
    workstepInstanceId: string,
    anchorHash: string,
  ): Promise<void>;

  getAnchorHash(workstepInstanceId: string): Promise<string>;

  verifyProof(verifierAddress: string, witness: Witness): Promise<boolean>;
}
